import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import HistoricoJogador from 'App/Models/aplicativo/historico_jogador/HistoricoJogador';
import Jogo from 'App/Models/aplicativo/jogo/Jogo';
import PlacarJogo from 'App/Models/aplicativo/placar-jogo/PlacarJogo';

export default class HistoricoJogadorController {
    public async salvarPlacarGols({ request, response }: HttpContextContract) {
        try {
            const data = request.body()
            for (const jogadorGol of data.golsJogador) {
                const jogador = await HistoricoJogador.query().select().where('codigo_historico_jogo', jogadorGol.codigoHistorico)
                    .andWhere('codigo_jogador', jogadorGol.codigo_jogador).first()
                if (jogador) {
                    jogador.gols_partida = Number(jogadorGol.gols)
                    jogador?.save()
                }
            }
            for (const placarEquipe of data.golsEquipe) {

                if (placarEquipe.codigoEquipe2) {
                    const golsEquipe2 = await PlacarJogo.query().select().where('codigo_historico_jogo', placarEquipe.codigoHistorico)
                        .andWhere('codigo_equipe', placarEquipe.codigoEquipe2).first()
                    if (golsEquipe2) {
                        golsEquipe2.placar_jogo = placarEquipe.placarEquipe2,
                            golsEquipe2.nome_equipe = placarEquipe.nome_equipe
                        golsEquipe2.save()
                    } else {
                        await PlacarJogo.create({
                            placar_jogo: placarEquipe.placarEquipe2,
                            codigo_equipe: placarEquipe.codigoEquipe2,
                            codigo_historico_jogo: placarEquipe.codigoHistorico,
                            nome_equipe: placarEquipe.nome_equipe
                        })
                    }
                }
                if (placarEquipe.codigoEquipe1) {
                    const golsEquipe1 = await PlacarJogo.query().select().where('codigo_historico_jogo', placarEquipe.codigoHistorico)
                        .andWhere('codigo_equipe', placarEquipe.codigoEquipe1).first()

                    if (golsEquipe1) {
                        golsEquipe1.placar_jogo = placarEquipe.placarEquipe1
                        golsEquipe1.nome_equipe = placarEquipe.nome_equipe
                        golsEquipe1.save()
                    } else {
                        await PlacarJogo.create({
                            placar_jogo: placarEquipe.placarEquipe1,
                            codigo_equipe: placarEquipe.codigoEquipe1,
                            codigo_historico_jogo: placarEquipe.codigoHistorico,
                            nome_equipe: placarEquipe.nome_equipe
                        })
                    }
                }

            }
        } catch (error) {
            console.log(error)
            return response.status(500).json({ msg: 'Erro ao processar', error: error.message })
        }
    }

    public async getHistoricoJogo({ params, response }: HttpContextContract) {
        try {
            const historicoJogador = await HistoricoJogador.query().select()
                .preload('equipe').preload('jogador').where('codigo_historico_jogo', params.codigo_historico_jogo).preload('avaliacao')
            return response.status(201).json({ data: historicoJogador })

        } catch (error) {
            console.log(error)
            return response.status(500).json({ msg: 'Erro ao processar', error: error.message })

        }


    }
    public async getHistoricoPorJogador({ params, response }: HttpContextContract) {
        try {
            const historicoJogador = await HistoricoJogador.query().select()
                .preload('historicoJogo', jogo => jogo.preload('jogo', jogo => jogo.preload('times', times => times.preload('equipes'))).preload('placar'))
                .preload('equipe').where('codigo_jogador', params.codigo_jogador).preload('avaliacao')
            return response.status(201).json({ data: historicoJogador })

        } catch (error) {
            console.log(error)
            return response.status(500).json({ msg: 'Erro ao processar', error: error.message })

        }


    }
    public async getJogosTime({ params }: HttpContextContract) {
        const timeJogo = await Jogo.query()
            .where('codigo_time_jogo', params.codigoTime)
            .preload('times').preload('diasemana')
        return timeJogo
    }


}
