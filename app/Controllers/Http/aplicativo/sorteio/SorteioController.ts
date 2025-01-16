import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import JogadoresSorteio from 'App/Models/aplicativo/Sorteio/JogadoresSorteio';


interface Jogador {
  avaliacao_comu_jogador: number | null;
  avaliacao_final_jogador: number | null;
  avaliacao_defesa_jogador: number | null;
  avalicao_media_jogador: number;
  avaliacao_marcacao_jogador: number | null;
  avaliacao_passe_jogador: number | null;
  avaliacao_respeito_jogador: number | null;
  avaliacao_velocidade_jogador: number | null;
  celular_jogador: string;
  codigo_jogador: number;
  codpes_jog: number;
  codigo_time_jogador: number;
  is_goleiro: boolean;
  data_nascimento_jogador: string;
  nome_jogador: string;
  codigo_posicao_jogador: number;
  posicao: {
    nome_posi: string;
  };
  goleiro_reserva_jogador?: boolean; // Add this if it’s not already present
  is_reserva?: boolean; // Add this if it’s not already present
}

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
        const sorteioAtualizar = await JogadoresSorteio.query().select().where('codigo_jogador', jogador.codigo_jogador).andWhere('codigo_jogo', jogador.codigo_jogo).first();
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
      .preload("jogador", jogador => jogador.preload('posicao'))
    return jogadoresSorteados

  }

  public async sortearEquipes({ request }: HttpContextContract) {

    let { jogadores, pesoHabilidade, pesoIdade, qtdJogadoresTitulares, considerarHabilidade, considerarIdade } =
      request.only(['jogadores', 'pesoHabilidade', 'pesoIdade', 'qtdJogadoresTitulares', 'considerarHabilidade', 'considerarIdade'])

    // Extrair lista de jogadores, se necessário
    jogadores = jogadores.map((joga: any) => joga.jogador).flat();

    const goleiros = jogadores.filter(jogador => jogador.posicao?.nome_posi.includes('Goleiro'));
    const reservasGoleiro = jogadores.filter(jogador => jogador.goleiro_reserva_jogador);

    const jogadoresSemGoleiro = jogadores.filter(jogador => !jogador.posicao?.nome_posi.includes('Goleiro') && !jogador.goleiro_reserva_jogador);

    const timeA: Jogador[] = [];
    const timeB: Jogador[] = [];

    // Alocar goleiros titulares e verificar reserva caso necessário
    if (goleiros.length >= 2) {
      // Dois goleiros titulares disponíveis
      timeA.push({ ...goleiros[0], is_goleiro: true });
      timeB.push({ ...goleiros[1], is_goleiro: true });
    } else if (goleiros.length === 1) {
      // Apenas um goleiro titular disponível, adicionar reserva se houver
      timeA.push({ ...goleiros[0], is_goleiro: true });
      if (reservasGoleiro.length > 0) {
        timeB.push({ ...reservasGoleiro[0], is_goleiro: true });
      }
    } else if (reservasGoleiro.length >= 2) {
      // Sem goleiros titulares, adicionar dois reservas
      timeA.push({ ...reservasGoleiro[0], is_goleiro: true });
      timeB.push({ ...reservasGoleiro[1], is_goleiro: true });
    }

    const calcularIdade = (dataNasc: string) => {
      const hoje = new Date();
      const dataNascimento = new Date(dataNasc);
      let idade = hoje.getFullYear() - dataNascimento.getFullYear();
      const diferencaMes = hoje.getMonth() - dataNascimento.getMonth();
      if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
      }
      return idade;
    };

    function calcularPontuacao(jogador: Jogador) {
      const idade = calcularIdade(jogador.data_nascimento_jogador);
      let pontuacao = 0;

      if (considerarHabilidade) {
        pontuacao += jogador.avalicao_media_jogador * pesoHabilidade;
      }
      if (considerarIdade) {
        pontuacao -= idade * pesoIdade;
      }

      return pontuacao;
    }

    const jogadoresOrdenados = jogadoresSemGoleiro
      .map(jogador => ({ ...jogador, pontuacao: calcularPontuacao(jogador) }))
      .sort((a, b) => b.pontuacao - a.pontuacao);

    for (let i = 0; i < qtdJogadoresTitulares; i++) {
      timeA.push(jogadoresOrdenados[i]);
      timeB.push(jogadoresOrdenados[i + qtdJogadoresTitulares]);
    }

    // Jogadores restantes como reservas
    const jogadoresRestantes = jogadoresOrdenados.slice(qtdJogadoresTitulares * 2);
    jogadoresRestantes.forEach(jogador => {
      const jogadorReserva = { ...jogador };
      if (timeA.length <= timeB.length) {
        timeA.push(jogadorReserva);
      } else {
        timeB.push(jogadorReserva);
      }
    });

    return {
      timeA,
      timeB,
    };
  }


}
