import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Jogador from 'App/Models/aplicativo/Cadastros/Jogador';
import Time from 'App/Models/aplicativo/Cadastros/Time';
import Notificacoes from 'App/Models/aplicativo/notificacao/Notificacao';
import Usuario from 'App/Models/Usuario';



export default class JogadorController {
  public async getNotificacao({ response , params}: HttpContextContract) {
    const {codigo_pessoa} = params
    const jogador = await Jogador.findBy('codigo_pessoa_jogador', codigo_pessoa)
    const usuario = await Usuario.findBy('codpes_usu', jogador?.codigo_pessoa_jogador)
    const times = await Time.query().select().where('pres_tim', String(usuario?.codigo_usu))
    const timesList = times.map(time => time.$attributes.codigo_tim)

    if(jogador === null) {return }
    const notificacao = await Notificacoes.query()
    .where('codigo_jogador_notificacao', jogador?.codigo_jogador).andWhereIn('codigo_time_notificacao', timesList).andWhere('visualizada_notificacao', false)
    return response.status(201).json({
        data: notificacao,
      });
  }

  public async limparNotificacao({request}: HttpContextContract){
    const body:any = request.body()
    for (const jogador of body) {
      const notificacao = await Notificacoes.findBy('codigo_notificacao',jogador.codigo_notificacao)
      if(notificacao !== null){
        notificacao?.merge({
          codigo_jogador_notificacao: jogador.codigo_jogador_notificacao,
          codigo_time_notificacao: jogador.codigo_time_notificacao,
          visualizada_notificacao: true
        })
        notificacao.save()
      }
    }
  }
}
