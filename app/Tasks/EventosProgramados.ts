import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task';
import TokenNotificationUser from 'App/Controllers/Http/aplicativo/NotificationController';
import { formatDateToMySQL } from 'App/helpers/commonHelper';
import ConfirmarPresenca from 'App/Models/aplicativo/confirma-presenca/ConfirmarPresenca';
import HistoricoJogo from 'App/Models/aplicativo/historico-jogo/HistoricoJogo';
import HistoricoJogador from 'App/Models/aplicativo/historico_jogador/HistoricoJogador';
import Jogo from 'App/Models/aplicativo/jogo/Jogo';
import JogadoresSorteio from 'App/Models/aplicativo/Sorteio/JogadoresSorteio';
import { DateTime } from 'luxon';

export default class EventoProgramado extends BaseTask {
  public static get schedule() {
    return '*/10 * * * * *' // Cron string para rodar a cada 10seg
    // return '0 18 * * *' // Cron string para rodar diariamente as 19h
  }

  public static get useLock() {
    return false
  }

  private ehHora1MaiorQueHora2 = (hora1, hora2) => {

    if (hora1 === null || hora2 === null) {
      return false
    }
    const converterParaMinutos = (horaString) => {
      const [horas, minutos, segundos] = horaString.split(':').map(Number);
      return horas * 60 + minutos + segundos / 60; // Converte tudo para minutos
    };

    const minutos1 = converterParaMinutos(hora1);
    const minutos2 = converterParaMinutos(hora2);
    return minutos1 > minutos2;
  };

  private retornaHoraAtual(dataAtual) {
    dataAtual.setHours(dataAtual.getHours());
    const horaAtual = dataAtual.getHours().toString().padStart(2, '0');
    const minutoAtual = dataAtual.getMinutes().toString().padStart(2, '0');
    return `${horaAtual}:${minutoAtual}:00`
  }

  private async limparConfirmados() {
    const dataAtual = new Date()
    const diaDaSemana = dataAtual.getDay()
    const horaFormatada = this.retornaHoraAtual(dataAtual)

    const jogos: any = await Jogo.query().select()
    for (const jogo of jogos) {
      if (Number(diaDaSemana) === Number(jogo.dia_jogo) && this.ehHora1MaiorQueHora2(horaFormatada, jogo.hora_final_jogo)) {
        const jogadoresConfirmados = await ConfirmarPresenca.query().select().where('codigo_jogo_confirmacao', jogo?.codigo_jogo)
        for (const jogadores of jogadoresConfirmados) {
          jogadores.presenca_confirmacao = false
          jogadores.data_confirmacao = null
          await jogadores.save()
        }
      }
    }

  }
  private async limparSorteio() {
    const dataAtual = new Date()
    const diaDaSemana = dataAtual.getDay()
    const horaFormatada = this.retornaHoraAtual(dataAtual)

    const jogos: any = await Jogo.query().select()
    for (const jogo of jogos) {
      if (Number(diaDaSemana) === Number(jogo.dia_jogo) && this.ehHora1MaiorQueHora2(horaFormatada, jogo.hora_final_jogo)) {
        const sorteio = await JogadoresSorteio.query().select().where('codigo_jogo', jogo?.codigo_jogo)
        for (const jogadorSorteio of sorteio) {
          await jogadorSorteio.delete()
        }
      }
    }

  }
  private async inserirHistoricoDeJogos() {
    const dataAtual = new Date()
    const diaDaSemana = dataAtual.getDay()
    const horaFormatada = this.retornaHoraAtual(dataAtual)

    const jogos: any = await Jogo.query().select()
    for (const jogo of jogos) {
      // if (Number(diaDaSemana) === Number(jogo.dia_jogo) && this.ehHora1MaiorQueHora2(horaFormatada, jogo.hora_final_jogo)) {
      const jogoAnterior = await HistoricoJogo.query().select().where('codigo_jogo', jogo?.codigo_jogo)
        .andWhere('data_jogo', formatDateToMySQL(dataAtual))
      if (jogoAnterior.length === 0) {
        const historicoJogo = await HistoricoJogo.create({
          codigo_jogo: jogo.codigo_jogo,
          data_jogo: DateTime.now()
        })
        const jogadorSorteio = await JogadoresSorteio.query().select().where('codigo_jogo', jogo?.codigo_jogo)
        if (jogadorSorteio.length > 0) {
          for (const jogador of jogadorSorteio) {
            await HistoricoJogador.create({
              codigo_jogador: jogador.codigo_jogador,
              codigo_historico_jogo: historicoJogo.codigo_historico_jogo,
              codigo_equipe: jogador.codigo_equipe,
              data_insercao: DateTime.now(),
              goleiro: jogador.isGoleiro
            })
          }
        }
      }
      // }
    }
  }
  private async inserirHistoricoDeJogadores() {
    const dataAtual = new Date()
    const diaDaSemana = dataAtual.getDay()
    const horaFormatada = this.retornaHoraAtual(dataAtual)

    const jogos: any = await Jogo.query().select()
    for (const jogo of jogos) {
      // if (Number(1) === Number(jogo.dia_jogo)) {
      const historicoJogo = await HistoricoJogo.query().select().where('codigo_jogo', jogo?.codigo_jogo).first()
      // .andWhere('data_insercao', formatDateToMySQL(dataAtual)).first()
      const jogadorSorteio = await JogadoresSorteio.query().select().where('codigo_jogo', jogo?.codigo_jogo)
      if (jogadorSorteio.length > 0 && historicoJogo) {
        for (const jogador of jogadorSorteio) {
          const jogadorJaInserido = await HistoricoJogador.query().select()
            .where('codigo_jogador', jogador.codigo_jogador).andWhere('data_insercao', formatDateToMySQL(dataAtual)).first()

          if (!jogadorJaInserido) {

            await HistoricoJogador.create({
              codigo_jogador: jogador.codigo_jogador,
              codigo_historico_jogo: historicoJogo.codigo_historico_jogo,
              codigo_equipe: jogador.codigo_equipe
            })
          }
        }
      }
      // }
    }
  }

  private async enviarNotificacaoDataConfigurada() {
    const jogos = await Jogo.query().select()
    const today = new Date()
    const todayDayOfWeek = today.getDay()
    for (const jogo of jogos) {
      const jogoDiaSemana = Number(jogo.dia_jogo)
      const daysUntilNextGame = this.calculateDaysUntilNextGame(todayDayOfWeek, jogoDiaSemana)
      if (daysUntilNextGame <= Number(jogo.dia_jogo)) {
        const notificacao = new TokenNotificationUser()
        notificacao.notificacaoConfirmarPresenca(jogo.codigo_time_jogo)
      }
    }
  }

  public async handle() {
    this.enviarNotificacaoDataConfigurada()
    this.inserirHistoricoDeJogos()
    this.inserirHistoricoDeJogadores()
    this.limparConfirmados()
    this.limparSorteio()
  }

  /**
   * Calcula quantos dias faltam até o próximo dia da semana (exemplo: próximo domingo)
   */
  private calculateDaysUntilNextGame(today: number, jogoDiaSemana: number): number {
    if (jogoDiaSemana >= today) {
      return jogoDiaSemana - today // O jogo é esta semana
    } else {
      return 7 - (today - jogoDiaSemana)
    }
  }
}
