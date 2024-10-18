import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Jogador from 'App/Models/aplicativo/Cadastros/Jogador';
import TimeJogador from 'App/Models/aplicativo/Cadastros/TimeJogador';
import ConfirmarPresenca from 'App/Models/aplicativo/confirma-presenca/ConfirmarPresenca';
import JogadorJogo from 'App/Models/aplicativo/jogo/JogadorJogo';
import Jogo from 'App/Models/aplicativo/jogo/Jogo';

export default class JogoController {
    public async insertOrUpdate({ request, response }: HttpContextContract) {
        try {
            const data = request.body()

            const body = {
                local_jogo: data.local_jogo,
                mensal_jogo: data.mensal_jogo,
                hora_inicio_jogo: data.hora_inicio_jogo,
                hora_final_jogo: data.hora_final_jogo,
                dia_jogo: data.dia_jogo,
                codigo_time_jogo: data.codigo_time_jogo,
                status_jogo: data.mensal_jogo ? 'Mensal' : 'Agendado',
                endereco_jogo: data.endereco_jogo,
                urlmaps_jogo: data.urlmaps_jogo,
                tipo_campo_jogo: data.tipo_campo_jogo,
                quantidade_jogador_jogo: data.quantidade_jogador_jogo,
                dias_notificacao_jogo: data.dias_notificacao_jogo,
                enviar_notificacao_jogo: data.enviar_notificacao_jogo,
                quantidade_minima_confirmados_jogo: data.quantidade_minima_jogador,
            }
            if (data.codigo_jogo) {
                let jogoatualizar = await Jogo.findBy('codigo_jogo', data.codigo_jogo)
                jogoatualizar?.merge(body).save()
                return response.status(200).json({ status: 200, msg: 'Jogo atualizado!' })
            }
            const jogadoresTime = await TimeJogador.query().select().where('codigo_time', body.codigo_time_jogo)

            let jogo: any = await Jogo.query().select().where('codigo_time_jogo', body.codigo_time_jogo).andWhere('dia_jogo', body.dia_jogo)
                .andWhere('hora_inicio_jogo', body.hora_inicio_jogo).andWhere('local_jogo', body.local_jogo)

            if (jogo.length > 0) {
                return response.status(201).json({ status: 201, msg: 'Já existe um jogo cadastrado no mesmo local,dia e hora!' })
            }

            if (jogo.length === 0) {
                jogo = await Jogo.create(body)
            }
            for (const jogador of jogadoresTime) {
                const codigoJogador = await Jogador.query().select().where('codigo_pessoa_jogador', data.codigo_pessoa).first()
                await JogadorJogo.create({
                    codigo_time: body.codigo_time_jogo,
                    codigo_jogador: jogador.codigo_jogador,
                    codigo_jogo: jogo.codigo_jogo
                })
                await ConfirmarPresenca.create({
                    codigo_jogador_confirmacao: jogador.codigo_jogador,
                    codigo_jogo_confirmacao: jogo.codigo_jogo,
                    presenca_confirmacao: codigoJogador?.codigo_jogador === jogador.codigo_jogador
                })
            }
            return response.status(201).json({ msg: 'Jogo cadastrado com sucesso!' })
        } catch (error) {
            console.log(error)
            return response.status(500).json({ msg: 'Erro ao processar', error: error.message })
        }
    }
    public async getJogos({ params }: HttpContextContract) {
        const jogador: any = await Jogador.query().select().where('codigo_pessoa_jogador', params.codigoPessoa)
        const codigoJogadorList = jogador.map(jogador => jogador.$attributes.codigo_jogador)

        const timeJogo = await JogadorJogo.query()
            .whereIn('codigo_jogador', codigoJogadorList)
            .preload("times")
            .preload('jogo', jogo => jogo.preload("sorteio"))

        return timeJogo
    }
    public async getJogosTime({ params }: HttpContextContract) {
        const timeJogo = await Jogo.query()
            .where('codigo_time_jogo', params.codigoTime)
            .preload('times').preload('diasemana')
        return timeJogo
    }

}
