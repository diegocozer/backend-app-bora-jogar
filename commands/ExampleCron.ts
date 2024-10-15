import { BaseCommand } from '@adonisjs/core/build/standalone';
import { cron } from 'node-cron';

export default class ExampleCron extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'example:cron'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest` 
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call 
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: true,
  }

  public async run() {
    this.logger.info('Hello world!')
    this.logger.info(`Cron disponível: ${typeof cron.schedule}`)
    cron.schedule('* * * * *', () => {
      this.logger.info('Cron job rodando a cada minuto')
      // Coloque aqui a lógica que deseja executar
    })
  }
}
