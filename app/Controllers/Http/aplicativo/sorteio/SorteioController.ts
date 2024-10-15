import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import JogadoresSorteio from 'App/Models/aplicativo/Sorteio/JogadoresSorteio';

export default class SorteiosController {
  public async insertOrUpdate({ request, response }: HttpContextContract) {
    try {
      const body = request.body()
      const jogadoresEquipe1 = body.equipe1.map((jogador: any) => ({
        nome_jogador: jogador.nome_jogador,
        avaliacao_media_jogador: jogador.avalicao_media_jogador,
        goleiro_reserva_jogador: jogador.goleiro_reserva_jogador,
        isGoleiro: jogador.is_goleiro ? 1 : 0,
        isReserva: jogador.is_reserva ? 1 : 0,
        codigo_jogo: jogador.codigo_jogo,
        codigo_equipe: jogador.codigo_equipe,
        codigo_jogador: jogador.codigo_jogador,
      }))

      const jogadoresEquipe2 = body.equipe2.map((jogador: any) => ({
        nome_jogador: jogador.nome_jogador,
        avaliacao_media_jogador: jogador.avalicao_media_jogador,
        goleiro_reserva_jogador: jogador.goleiro_reserva_jogador,
        isGoleiro: jogador.is_goleiro ? 1 : 0,
        isReserva: jogador.is_reserva ? 1 : 0,
        codigo_jogo: jogador.codigo_jogo,
        codigo_equipe: jogador.codigo_equipe,
        codigo_jogador: jogador.codigo_jogador,
      }))
      const jogadores = [...jogadoresEquipe1, ...jogadoresEquipe2]
      const result: any[] = []
      for (const jogador of jogadores) {
        let jogadorAtualizado;
        const sorteioAtualizar = await JogadoresSorteio.findBy('codigo_jogador', jogador.codigo_jogador);
        await sorteioAtualizar?.delete()
        jogadorAtualizado = await JogadoresSorteio.create(jogador);
        result.push(jogadorAtualizado)
      }
      return response.status(201).json({ data: result })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ msg: 'Erro ao processar', error: error.message })
    }
  }

  public async getJogadoresSorteio({ auth, params }: HttpContextContract) {
    const jogadoresSorteados = await JogadoresSorteio.query().where('codigo_jogo', params.codigoTime)
    return jogadoresSorteados

  }


}
