import Database from '@ioc:Adonis/Lucid/Database';
import { calcularMedia, formatDateToMySQL } from 'App/helpers/commonHelper';
import Jogador from 'App/Models/aplicativo/Cadastros/Jogador';
import Time from 'App/Models/aplicativo/Cadastros/Time';
import TimeJogador from 'App/Models/aplicativo/Cadastros/TimeJogador';
import ConfirmarPresenca from 'App/Models/aplicativo/confirma-presenca/ConfirmarPresenca';
import JogadorJogo from 'App/Models/aplicativo/jogo/JogadorJogo';
import Jogo from 'App/Models/aplicativo/jogo/Jogo';
import Notificacoes from 'App/Models/aplicativo/notificacao/Notificacao';

import { Storage } from '@google-cloud/storage';
import Application from '@ioc:Adonis/Core/Application';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Posicao from 'App/Models/aplicativo/Posicao/Posicao';
import Pessoa from 'App/Models/Pessoa';
import path from 'path';
const storage = new Storage({
  keyFilename: path.join(Application.appRoot, './borajogarapp-7ea50-firebase-adminsdk-b98z2-b69936fc63.json'),
})

const bucketName = 'foto-usuario'

export default class JogadorController {

  public async insertOrUpdateFotoPerfilJogador({request, response}: HttpContextContract){
      const image = request.file('image', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg', 'txt'], 
      })
      if (!image) {
        return response.badRequest('Imagem não enviada')
      }
  
      const uniqueFileName = `${new Date().getTime()}_${image.clientName}`
  
      const filePath = path.join(Application.tmpPath('uploads'), uniqueFileName)
  
      await image.move(Application.tmpPath('uploads'), {
        name: uniqueFileName,
      })
  
      await storage.bucket(bucketName).upload(filePath, {
        destination: uniqueFileName,
        public: true,
      })
  
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`
  
      // Retornar a URL da imagem para o frontend
      return response.json({ url: publicUrl })
    
  }
  public async insertOrUpdate({ request, response }: HttpContextContract) {
    const trx = await Database.transaction();
    try {
      let {
        avaliacao_comu_jogador,
        avaliacao_final_jogador,
        avaliacao_defesa_jogador,
        avaliacao_marcacao_jogador,
        avaliacao_passe_jogador,
        avaliacao_respeito_jogador,
        avaliacao_velocidade_jogador,
        celular_jogador,
        codigo_time_jogador,
        data_nascimento_jogador,
        nome_jogador,
        codigo_posicao_jogador
      } = request.only([
        "avaliacao_comu_jogador",
        "avaliacao_final_jogador",
        "avaliacao_defesa_jogador",
        "avaliacao_marcacao_jogador",
        "avaliacao_passe_jogador",
        "avaliacao_respeito_jogador",
        "avaliacao_velocidade_jogador",
        "celular_jogador",
        "codigo_time_jogador",
        "data_nascimento_jogador",
        "nome_jogador",
        "codigo_posicao_jogador"
      ]);
  
      const mediaNotas = calcularMedia([
        avaliacao_comu_jogador,
        avaliacao_final_jogador,
        avaliacao_defesa_jogador,
        avaliacao_marcacao_jogador,
        avaliacao_passe_jogador,
        avaliacao_respeito_jogador,
        avaliacao_velocidade_jogador,
      ]);
  
      const tipoPosicao = await Posicao.findBy('codigo_posi', codigo_posicao_jogador);
      let pessoa = await Pessoa.query().where('numcel_pes', celular_jogador).first();
  
      const formattedDate = formatDateToMySQL(data_nascimento_jogador);
  
      if (pessoa) {
        pessoa.merge({
          nomraz_pes: nome_jogador,
          datnas_pes: formattedDate,
          numcel_pes: celular_jogador
        });
        await pessoa.save();
      } else {
        pessoa = await Pessoa.create({
          nomraz_pes: nome_jogador,
          datnas_pes: formattedDate,
          numcel_pes: celular_jogador
        });
      }
  
      if (tipoPosicao?.$attributes.nome_posi !== 'Goleiro') {
        avaliacao_defesa_jogador = null;
      } else {
        avaliacao_marcacao_jogador = null;
      }
  
      let msg = 'Jogador cadastrado com sucesso!';
      let jogador;
  
      if (!pessoa.$attributes.codigo_pes) {
        const pessoaRecuperada = await Pessoa.query({ client: trx })
          .where('nomraz_pes', nome_jogador)
          .andWhere('numcel_pes', celular_jogador)
          .first();
  
        if (pessoaRecuperada) {
          pessoa.$attributes.codigo_pes = pessoaRecuperada.codigo_pes;
        }
      }
  
      const jogadorAtualizar = await Jogador
        .query({ client: trx })
        .where('celular_jogador', celular_jogador)
        .first();
  
      if (jogadorAtualizar) {
        jogadorAtualizar.merge({
          codigo_pessoa_jogador: pessoa.$attributes.codigo_pes,
          avaliacao_comu_jogador,
          avaliacao_final_jogador,
          avaliacao_defesa_jogador,
          avaliacao_marcacao_jogador,
          avaliacao_passe_jogador,
          avaliacao_respeito_jogador,
          avaliacao_velocidade_jogador,
          celular_jogador,
          data_nascimento_jogador: formattedDate,
          nome_jogador,
          codigo_posicao_jogador,
          avaliacao_media_jogador: Number(mediaNotas)
        });
        await jogadorAtualizar.save();
        msg = 'Jogador atualizado com sucesso!';
        jogador = jogadorAtualizar; 
      } else {
        jogador = await Jogador.create({
          codigo_pessoa_jogador: pessoa.$attributes.codigo_pes,
          avaliacao_comu_jogador,
          avaliacao_final_jogador,
          avaliacao_defesa_jogador,
          avaliacao_marcacao_jogador,
          avaliacao_passe_jogador,
          avaliacao_respeito_jogador,
          avaliacao_velocidade_jogador,
          celular_jogador,
          data_nascimento_jogador: formattedDate,
          nome_jogador,
          codigo_posicao_jogador,
          avaliacao_media_jogador: Number(mediaNotas)
        });
      }
  
      await jogador.save();
      await trx.commit();  // Commit após operações principais para evitar lock
  
      // Início de uma nova transação para Confirmar Presença e TimeJogador
      const trx2 = await Database.transaction();
  
      const jogo = await Jogo.query().select().where('codigo_time_jogo', codigo_time_jogador).first();
      if (jogo !== null) {
        const existeJogador = await ConfirmarPresenca.query().select().where('codigo_jogo_confirmacao', jogo.codigo_jogo)
          .andWhere('codigo_jogador_confirmacao', jogador.codigo_jogador);
          
        if (existeJogador.length === 0) {
          await TimeJogador.create({
            codigo_time: codigo_time_jogador,
            codigo_jogador: jogador.codigo_jogador
          }, { client: trx2 });

             await JogadorJogo.create({
            codigo_time:codigo_time_jogador,
            codigo_jogador: jogador.codigo_jogador,
            codigo_jogo: jogo.codigo_jogo
        }, { client: trx2 })
  
          await ConfirmarPresenca.create({
            codigo_jogador_confirmacao: jogador.codigo_jogador,
            codigo_jogo_confirmacao: jogo.codigo_jogo
          }, { client: trx2 });
        }
      }
  
      await trx2.commit();  // Commit final
      return response.status(201).json({
        msg,
        data: jogador
      });
    } catch (error) {
      await trx.rollback();
      return response.status(500).json({
        msg: 'Ocorreu um erro ao processar a requisição',
        error: error.message
      });
    }
  }
  public async convidarJogadores({ request, response }: HttpContextContract) {
    const trx = await Database.transaction(); 
    try {
      const jogadores = request.body() || [];
      let jogadoresJaCadastrados = '';
      let jogadoresAdicionados: any[] = [];
      
      for (const [key, jogador] of Object.entries(jogadores)) {
        const jogo = await Jogo.query({ client: trx })
          .select()
          .where('codigo_time_jogo', jogador.codigoTime)
          .first();
  
        if (!jogo) continue;
  
        const existeJogador = await TimeJogador.query({ client: trx })
          .select()
          .where('codigo_jogador', jogador.codigo_jogador)
          .andWhere('codigo_time', jogador.codigoTime);
  
        if (existeJogador.length > 0) {
          jogadoresJaCadastrados = jogadoresJaCadastrados.length > 0 
            ? `${jogadoresJaCadastrados}, ${jogador.nome_jogador}` 
            : jogador.nome_jogador;
        } else {
          await TimeJogador.create({
            codigo_time: jogador.codigoTime,
            codigo_jogador: jogador.codigo_jogador,
            ativo_time: true
          }, { client: trx });
  
          jogadoresAdicionados.push(jogador);
        }
      }
  
      await trx.commit();
  
      if (jogadoresJaCadastrados.length > 0) {
        return response.status(201).json({
          msg: `Jogador(es) ${jogadoresJaCadastrados} já vinculado(s) ao seu time!`,
          data: jogadoresAdicionados,
        });
      }
  
      return response.status(201).json({
        msg: 'Jogador(es) convidado(s) com sucesso!',
        data: jogadoresAdicionados,
      });
  
    } catch (error) {
      await trx.rollback();
      return response.status(500).json({
        msg: 'Ocorreu um erro ao processar a requisição',
        error: error.message,
      });
    }
  }



  public async getConvites({ params, response }: HttpContextContract) {
    const jogador = await Jogador.query()
        .select()
        .where('codigo_pessoa_jogador', params.codigoPessoa)
        .first();
    if (jogador) {
        // Busca convites onde convite_time é nulo
        const convites = await TimeJogador.query()
            .select()
            .where('codigo_jogador', jogador.codigo_jogador)
            .whereNull('convite_time')
            .preload('times', (time) => 
                time.preload('presidente', (pres) => 
                    pres.preload('pessoas')
                )
            )
        // Verifica se há convites
        if (convites.length > 0) {
            return response.status(200).json({ data: convites });
        } else {
            return response.status(200).json({ msg: 'Nenhum convite encontrado.', data: [] });
        }
    } else {
        return response.status(404).json({ msg: 'Jogador não encontrado.' });
    }
}


  public async updateConvite({ request, response }: HttpContextContract) {
    const trx = await Database.transaction();
    try {
      const body = request.body();
  
      // Busca os jogos associados ao time
      const jogos = await Jogo.query({ client: trx })
        .select()
        .where('codigo_time_jogo', body.codigo_time)
        .forUpdate() 
  
      if (jogos.length > 0) {
        for (const jogo of jogos) {
          const jogadorJogo = await JogadorJogo.query({ client: trx })
            .select()
            .where('codigo_jogador', body.codigo_jogador)
            .andWhere('codigo_time', body.codigo_time)
            .andWhere('codigo_jogo', jogo.codigo_jogo)
            .forUpdate() 
            .first();
          if (jogadorJogo === null ) {
            await JogadorJogo.create({
              codigo_jogador: body.codigo_jogador,
              codigo_time: body.codigo_time,
              codigo_jogo: jogo.codigo_jogo
            }, { client: trx });
            await ConfirmarPresenca.create({
              codigo_jogador_confirmacao: body.codigo_jogador,
              codigo_jogo_confirmacao: jogo.codigo_jogo
            }, { client: trx });
          }
        }
      }
  
      // precisei fazer assim pois estava com um erro e não soube como resolver usando o merge
      const updateTimeJogador = await trx.rawQuery(
        `UPDATE time_jogador 
         SET convite_time = ?
         WHERE codigo_jogador = ? AND codigo_time = ?`,
        [body.convite_time, body.codigo_jogador, body.codigo_time]
      );
  
      if (updateTimeJogador[0].affectedRows > 0) {
        const jogador = await Jogador.findBy('codigo_jogador', body.codigo_jogador)
        const time = await Time.findBy('codigo_tim', body.codigo_time)
        if(jogador !== null){
         await Notificacoes.create({
            label_notificacao: `Jogador "${jogador.nome_jogador}" ${body.convite_time ? 'aceitou' : 'recusou'} o convite para participar do time "${time?.nome_tim}"!`,
            codigo_jogador_notificacao: jogador.codigo_jogador,
            codigo_time_notificacao: body.codigo_time
          })
        }
        await trx.commit();
        return response.status(200).json({
          msg: 'Convite atualizado com sucesso',
        });
      } else {
        await trx.rollback(); 
        return response.status(404).json({
          msg: 'Nenhum registro encontrado para atualizar',
        });
      }
    } catch (error) {
      await trx.rollback(); 
      console.error('Erro ao atualizar o convite:', error);
      return response.status(500).json({
        msg: 'Erro ao atualizar o convite',
        error,
      });
    }
  }
  

  public async jogadores(){
    try {
      const jogadores = await Jogador.query().select().preload('posicao')
      return jogadores
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error)
      throw error
    }
  }
  
  public async getJogadores({ params }: HttpContextContract) {
    const jogadores = await JogadorJogo.query().select().where('codigo_jogo', params.codtim_jog)
    .preload('jogador', jogador => jogador.preload('posicao')).preload('jogo', jogo => jogo.preload('times'))
    return jogadores
  }
}
