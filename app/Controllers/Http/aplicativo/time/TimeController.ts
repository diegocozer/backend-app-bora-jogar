import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Jogador from 'App/Models/aplicativo/Cadastros/Jogador';
import Time from 'App/Models/aplicativo/Cadastros/Time';
import TimeJogador from 'App/Models/aplicativo/Cadastros/TimeJogador';


export default class CadastrarTimeController {
  public async insertOrUpdate({ request, response }: HttpContextContract) {
    const trx = await Database.transaction()
    try {
      const body = request.only(['nome_tim', 'pres_tim', 'tipo_campo', 'qtdjo_tim', 'dnot_tim', 'escudo_tim']);
      const codigo_pessoa_jogador = request.input('codigo_pessoa_jogador');
      const { nome_jogador, celular_jogador } = request.only(['nome_jogador', 'celular_jogador']);
      if(!body.escudo_tim){
        body.escudo_tim = ''
      }
      let msg = 'Time criado com sucesso!';
      let time;
      
      time = await Time.query({ client: trx })
        .select()
        .where('nome_tim', body.nome_tim)
        .andWhere('pres_tim', body.pres_tim)
        .andWhere('tipo_campo', body.tipo_campo)
        .first();
      
      if (time) {
        time.merge(body);
        await time.useTransaction(trx).save();
        msg = 'Time atualizado com sucesso!';
      } else {
        time = await Time.create(body, { client: trx });
      }

      let jogador = await Jogador.findBy('codigo_pessoa_jogador', codigo_pessoa_jogador, { client: trx });

      if (!jogador) {
        jogador = new Jogador();
        jogador.merge({
          nome_jogador,
          celular_jogador,
          codigo_posicao_jogador: 3,
          codigo_pessoa_jogador: Number(codigo_pessoa_jogador),
        });
        await jogador.useTransaction(trx).save();
      } else {
        jogador.merge({
          nome_jogador,
          celular_jogador,
        });
        await jogador.useTransaction(trx).save();
      }

      await TimeJogador.create({
        codigo_time: time.$attributes.codigo_tim,
        codigo_jogador: jogador.codigo_jogador,
      }, { client: trx });

      await trx.commit();

      return response.status(201).json({
        msg: msg,
        data: time,
      });
    } catch (error) {
      await trx.rollback();
      return response.status(500).json({
        msg: 'Ocorreu um erro ao processar a requisição',
        error: error.message,
      });
    }
  }


  public async getTime({ auth, params }: HttpContextContract) {
    const timeJogador = await TimeJogador.query().select().where('codigo_jogador', params.codigoJog).preload('times')
    return timeJogador
  }
  public async getTimePresi({ auth, params }: HttpContextContract) {
    const time = await Time.query().select().where('pres_tim', params.pres_tim)
    return time
  }

}
