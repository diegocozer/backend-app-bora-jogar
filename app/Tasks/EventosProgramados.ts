import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task'
import TokenNotificationUser from 'App/Controllers/Http/aplicativo/NotificationController'
import Time from 'App/Models/aplicativo/Cadastros/Time'
import ConfirmarPresenca from 'App/Models/aplicativo/confirma-presenca/ConfirmarPresenca'
import Jogo from 'App/Models/aplicativo/jogo/Jogo'

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

  private async enviarNotificacaoDataConfigurada() {
    const jogos = await Jogo.query().select()
    const today = new Date()
    const todayDayOfWeek = today.getDay()

    for (const jogo of jogos) {
      const jogoDiaSemana = Number(jogo.dia_jogo)
      const times = await Time.query().select().where('codigo_tim', jogo.codigo_time_jogo)
      for (const time of times) {
        const daysUntilNextGame = this.calculateDaysUntilNextGame(todayDayOfWeek, jogoDiaSemana)
        // if (daysUntilNextGame <= time.dnot_tim) {
          const notificacao = new TokenNotificationUser()
          notificacao.notificacaoConfirmarPresenca(time.codigo_tim)
        // }
      }
    }
  }

  public async handle() {
    this.enviarNotificacaoDataConfigurada()
    this.limparConfirmados()
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
