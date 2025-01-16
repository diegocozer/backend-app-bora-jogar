import Database from '@ioc:Adonis/Lucid/Database';
import { formatDateToMySQL } from 'App/helpers/commonHelper';
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
import AvaliacaoJogador from 'App/Models/aplicativo/avaliacao-jogador/AvaliacaoJogador';
import HistoricoJogador from 'App/Models/aplicativo/historico_jogador/HistoricoJogador';
import Pessoa from 'App/Models/Pessoa';
import path from 'path';
const storage = new Storage({
  keyFilename: path.join(Application.appRoot, './borajogarapp-7ea50-firebase-adminsdk-b98z2-b69936fc63.json'),
})

const bucketName = 'foto-usuario'

export default class JogadorController {
  public async salvarAvaliacaoJogador({ request, response }: HttpContextContract) {
    try {
      let {
        codigoJogador,
        defesa,
        marcacao,
        passe,
        respeito,
        velocidade,
        codigoHistorico

      } = request.only([
        "codigoJogador",
        "defesa",
        "marcacao",
        "passe",
        "respeito",
        "velocidade",
        "codigoHistorico"
      ]);

      const historicoJogador = await HistoricoJogador.query().select().where('codigo_historico_jogo', codigoHistorico)
        .andWhere('codigo_jogador', codigoJogador).first()
      let avaliacao
      if (historicoJogador) {
        if (historicoJogador.codigo_avaliacao) {
          avaliacao = await AvaliacaoJogador.findBy('codigo_avaliacao', historicoJogador.codigo_avaliacao)
          console.log(avaliacao)
          if (avaliacao) {
            avaliacao.merge({
              velocidade_avaliacao: velocidade,
              defesa_avaliacao: defesa,
              marcacao_avaliacao: marcacao,
              respeito_avaliacao: respeito,
              passe_avaliacao: passe
            }).save()

          }
        } else {
          avaliacao = await AvaliacaoJogador.create({
            velocidade_avaliacao: velocidade,
            defesa_avaliacao: defesa,
            marcacao_avaliacao: marcacao,
            respeito_avaliacao: respeito,
            passe_avaliacao: passe
          })
          historicoJogador.merge({
            codigo_avaliacao: avaliacao.codigo_avaliacao
          }).save()
        }
      }
    } catch (error) {

    }
  }

  public async insertOrUpdateFotoPerfilJogador({ request, response }: HttpContextContract) {
    try {


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

      return response.json({ url: publicUrl })
    } catch (error) {
      console.log(error)
    }
  }
  public async salvarFotoJogador({ request }: HttpContextContract) {
    try {
      const { codigo_jogador, url_foto } = request.body()
      const jogador = await Jogador.findBy('codigo_jogador', codigo_jogador)
      if (jogador) {
        jogador.merge({ foto_jogador: url_foto }).save()
      }

    } catch (error) {
      console.log(error)
    }
  }
  public async getFotoJogador({ params, response }: HttpContextContract) {
    const { codigo_jogador } = params
    const fotoJogador = await Jogador.findBy("codigo_pessoa_jogador", codigo_jogador)
    if (fotoJogador) {
      return response.status(200).json({
        data: { url: fotoJogador?.$attributes.foto_jogador || '' },
        status: 200
      });
    }
  }
  public async insertOrUpdate({ request, response }: HttpContextContract) {
    const trx = await Database.transaction();
    try {
      let {
        foto_jogador,
        celular_jogador,
        codigo_time_jogador,
        data_nascimento_jogador,
        nome_jogador,
        codigo_posicao_jogador,
        codigo_jogador
      } = request.only([
        "codigo_jogador",
        "foto_jogador",
        "celular_jogador",
        "codigo_time_jogador",
        "data_nascimento_jogador",
        "nome_jogador",
        "codigo_posicao_jogador"
      ]);

      // const mediaNotas = calcularMedia([
      //   avaliacao_comu_jogador,
      //   avaliacao_final_jogador,
      //   avaliacao_defesa_jogador,
      //   avaliacao_marcacao_jogador,
      //   avaliacao_passe_jogador,
      //   avaliacao_respeito_jogador,
      //   avaliacao_velocidade_jogador,
      // ]);

      // const tipoPosicao = await Posicao.findBy('codigo_posi', codigo_posicao_jogador);
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

      // if (tipoPosicao?.$attributes.nome_posi !== 'Goleiro') {
      //   avaliacao_defesa_jogador = null;
      // } else {
      //   avaliacao_marcacao_jogador = null;
      // }

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
      if (codigo_jogador) {

        const jogadorAtualizar = await Jogador
          .query({ client: trx })
          .where('codigo_jogador', codigo_jogador)
          .first();

        if (jogadorAtualizar) {
          const jogadorCelular = await Jogador
            .query({ client: trx })
            .where('celular_jogador', celular_jogador).andWhereNot('codigo_jogador', codigo_jogador)
            .first();
          if (jogadorCelular) {
            msg = 'Já existe um jogador com esse número de celular!';
            return response.status(201).json({
              msg,
              data: jogador,
              status: 201
            });

          }
          jogadorAtualizar.merge({
            celular_jogador,
            data_nascimento_jogador: formattedDate,
            nome_jogador,
            codigo_posicao_jogador,
            foto_jogador: foto_jogador ? foto_jogador.url : null
          });
          await jogadorAtualizar.save();
          msg = 'Jogador atualizado com sucesso!';
          jogador = jogadorAtualizar;
        }
      } else {
        jogador = await Jogador.create({
          codigo_pessoa_jogador: pessoa.$attributes.codigo_pes,
          celular_jogador,
          data_nascimento_jogador: formattedDate,
          nome_jogador,
          codigo_posicao_jogador,
          foto_jogador: foto_jogador ? foto_jogador.url : null
        });
      }
      await jogador.save();
      await trx.commit();

      const trx2 = await Database.transaction();
      if (codigo_time_jogador) {

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
              codigo_time: codigo_time_jogador,
              codigo_jogador: jogador.codigo_jogador,
              codigo_jogo: jogo.codigo_jogo
            }, { client: trx2 })

            await ConfirmarPresenca.create({
              codigo_jogador_confirmacao: jogador.codigo_jogador,
              codigo_jogo_confirmacao: jogo.codigo_jogo
            }, { client: trx2 });
          }
        }
      }

      await trx2.commit();  // Commit final
      return response.status(200).json({
        msg,
        data: jogador,
        status: 200
      });
    } catch (error) {
      await trx.rollback();
      console.log(error)
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
          if (jogadorJogo === null) {
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
        if (jogador !== null) {
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


  public async jogadores({ params }: HttpContextContract) {
    try {

      const jogadoresTime = await TimeJogador.query().select().where('codigo_time', params.codigoTime)
      const jogadoresList = jogadoresTime.map((jogador) => jogador.codigo_jogador)
      const jogadores = await Jogador.query().select().whereNotIn('codigo_jogador', jogadoresList).preload('posicao')
      return jogadores
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error)
      throw error
    }
  }

  public async getJogadores({ params }: HttpContextContract) {
    const jogadores = await TimeJogador.query().select().where('codigo_time', params.codigo_jogo)
      .preload('jogador', jogador => jogador.preload('posicao'))
    return jogadores
  }

  public async getJogadoresConfirmadosSorteio({ params }: HttpContextContract) {

    const jogadoresConfirmados = await ConfirmarPresenca.query().select()
      .preload('jogo', (jogo) => jogo.preload('times'))
      .preload('jogador', (jogador) => jogador.preload('posicao'))
      .where('presenca_confirmacao', true)
      .andWhere('codigo_jogo_confirmacao', params.codigo_jogo)

    return jogadoresConfirmados
  }
  public async getJogadoresConfirmados({ params, request }: HttpContextContract) {
    const { query } = request.qs() as Record<string, any>
    const { naoConfirmados, confirmados } = JSON.parse(query)

    const jogadoresConfirmados = await ConfirmarPresenca.query().select()
      .preload('jogo', (jogo) => jogo.preload('times'))
      .preload('jogador', (jogador) => jogador.preload('posicao'))
      .where((query) => {
        if (confirmados && !naoConfirmados) {
          query.where('presenca_confirmacao', true)
        } else if (naoConfirmados && !confirmados) {
          query.where('presenca_confirmacao', false)
        }
      })
      .where('codigo_jogo_confirmacao', params.codigo_jogo)

    return jogadoresConfirmados
  }

}
