import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import { getDayOfWeek } from 'App/helpers/commonHelper';
import Jogador from 'App/Models/aplicativo/Cadastros/Jogador';
import Time from 'App/Models/aplicativo/Cadastros/Time';
import TimeJogador from 'App/Models/aplicativo/Cadastros/TimeJogador';
import Equipe from 'App/Models/aplicativo/Equipe/Equipe';
import JogadorJogo from 'App/Models/aplicativo/jogo/JogadorJogo';
import Jogo from 'App/Models/aplicativo/jogo/Jogo';
import TokenUserNotification from 'App/Models/aplicativo/TokenUser';
import axios from 'axios';
import { google } from 'googleapis';

export default class TokenNotificationUser {
  private readonly pushUrl = 'https://fcm.googleapis.com/v1/projects/borajogarapp-7ea50/messages:send';

  public async verificaExisteTokenNotification({ request, response, params }: HttpContextContract) {
    try {

      const { token } = params
      const codigoJogador = request.qs().codigoJogador
      const expoPushTokens = await Database.from('tokenusuarionotificacao').select('token_ton').where('token_ton', token).andWhere('codigo_pessoa_token', codigoJogador);
      response.status(200).json({ data: expoPushTokens.length > 0 ? true : false });
    } catch (error) {
      console.log('savetoken', error)
    }
  }
   private async getAccessToken() {
    const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
    const SCOPES = [MESSAGING_SCOPE];
  
    const jwtClient = new google.auth.JWT(
      'firebase-adminsdk-b98z2@borajogarapp-7ea50.iam.gserviceaccount.com',
      '',
      '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2Z6Rk6IXZtqVz\nzdkeZewzXRq42wXNJKRHlQXrS3VPS/LvXueTphH8RTVfccbu8FaD+1EUsazQiEYU\nfvY3bwD/rYYG6aVAzyaW5Z2/yftiuTwna8FOm4jsgtOhNfP0RGaUhR592bHDG29g\nQzCgZEJ9DXoNgPjaFpXlmHWYKGIeoVkZ6pYhj11Z4ACgfJ6FxqdWAoUS1v9TlJjN\nmOtV/V/KZ0a27fQQ7fzneUqERG1O4/2msVsidSWeEhCCQ7PwKWsOEGYNJeLRr9Pn\nroFdWv0GYHEMIysrieiNahPqm6Iy9KPMRoR6dHwhzI7RjaaQMS1tAOgRYN8JIbi6\nOVOWJZFxAgMBAAECggEAE9aUWNw4OIxGlOB5wXZc2N5CqoG5sQzP6DAjR2q6zL/K\nIXIdNh/8+0asrh+B/xk5E5wo/prvXHPByXdggHlsbqJY/hX5wOF2xTkebc5CLsPO\nMMxlpw6/9tcovLMRQAsTbApJXW8oh/uLIrlUB9G3sIGfeWoCRrfnoCOzgHO97i43\nLM5PYfzrRKGFJwh/LHj9uO76jZS0SbbpetSTzEU1Bbf1FMLAyY2SnKpldd0fm8i5\n9YhD7Pg+H++o2OOmOO3bDZ3+cSRERuhX28LsFqQkFuOxavKbUHrFB37xcScFHaT5\nj0vwa/5wNfJqGm1Mu+sRe1kVx2PzUAq+st7g3mKPhQKBgQD6m9BZ5NawQE2LDEPN\nSb/+TMsyK0KvOLB+fXF30cTRCePQ2iyVCymVlQIYBI1KPrtxED+dBcqAZ7APTGn8\nvYTuZvgS9FIeFn/OSfFXpucspK1vCD+EAieDX9m0DG9kkmIFmiVSRq4xDLGkt+OO\nikwHcHhEIgtlC37IURFBwUeiPQKBgQC6VDUA/flus/3NSvdKSlLZWH5Nob2RLb+r\nBM8xL2e7UUFtV6ghJ7+suur8XTuorH9eBbZ/C0lDyv4s1Brz9LGUNKEQQvCvCmn0\nLNqcRft4IpEZ5O3H5V2QcC4aBp2U9cDOuftZzU+1mrVApTzChrb9sRcBtlzprkKY\nSWwIMlKjRQKBgAytIv3ZEG774bA935QbveVsFv8jpwzb7jmHuNyZtL3qJSbkUkr7\ntI/HaMK0QD1YLP0MGFul9ldGZ2ZutBG/uGCivruetiSleLODk/yeCaV9cvRh02ym\n+z6u84Ei++N3cBPedzLRNnButvGhB5anMi9SJhM0MaVbzn7tctUDpM71AoGBAJDF\nbIlgy7Tf1Ir1fD4UkVqeD0RyLr/mM83E5tboZkh8UcGLIe7g22RxtrJuHjRoEm4T\nMkBznHE3/1UFWAvES1VDrwDbgfX+uWQmlZRmK4SkFulvnfB6nb/j6W3/ReC/MRdu\nGYUkqJIJqlqYCCV8ViG2vpFuB7Lo2oVIRs/3iY2hAoGBAIuLREUxk+58bkcGnbld\n2bV7xcTAGhFqdfm4l0sP2/g//OgQzt+yElMN2dQ/zN/vfkKw7lV1dOj7dEB+czde\ndoun8tMTh9hLrVprSytgbJNO8cAbF8+fRv4QrRiJ/Gqs0ES/d0l8J44T8WfzSFNX\n/KecOZ3TMFvnexJYESY1JLTa\n-----END PRIVATE KEY-----\n',
      SCOPES,
      ''
    );
  
    return new Promise((resolve, reject) => {
      jwtClient.authorize((err, tokens) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(tokens?.access_token);
      });
    });
  }
  

  public async sendPushNotification({ request, response }: HttpContextContract) {
    try {
      const beareTokenFireBase = await this.getAccessToken()
    let { title, body, data, pessoaEnvioMensagem, sorteio, codigo_jogo} = request.only(['title', 'body', 'data', 'pessoaEnvioMensagem', 'sorteio', 'subtitle', 'codigo_jogo']);
    let mensagemSorteio = ''
    let tituloMensagem = ''
      const expoPushTokens = await Database.from('jogadores_sorteio').select()
        .leftJoin(Jogador.table, 'jogador.codigo_jogador', 'jogadores_sorteio.codigo_jogador')
        .leftJoin(Jogo.table, 'jogo.codigo_jogo', ' jogadores_sorteio.codigo_jogo')
        .leftJoin(Time.table, 'jogo.codigo_time_jogo', 'codigo_tim')
        .leftJoin(Equipe.table, 'equipes.codigo_equipe', 'jogadores_sorteio.codigo_equipe')
        .innerJoin(TokenUserNotification.table, 'codigo_pessoa_token', 'codigo_pessoa_jogador')
        .andWhere('jogadores_sorteio.codigo_jogo', codigo_jogo || 0).andWhereNot('token_ton', pessoaEnvioMensagem || 0)

      // const expoPushTokens = await Database.from('tokenusuarionotificacao').select('token_ton').whereNot('token_ton', tokenDispositivo)
      for (const tokenNotificacao of expoPushTokens) {
        let mediaJogador = 4
        if (sorteio) {
          mensagemSorteio = `Equipe: ${tokenNotificacao.nome_equipe} \n${ mediaJogador >= 3 ? 'Contamos com você para a vitória do time 🥇' : ''}`
          tituloMensagem = `Time ${tokenNotificacao?.nome_tim} - Equipes sorteadas 🏆`
        }
        const mensagem = {
          message: {
            token: `${tokenNotificacao.token_ton}`,
            notification: {
              title:  tituloMensagem ? tituloMensagem : title,
              body: mensagemSorteio ? mensagemSorteio : body,
            }, data: {
              url: "ConfirmarPresenca",
            }
          }
        }
        // params: JSON.stringify({
        //   jogo: tokenNotificacao.nome_tim,
        //   equipe: tokenNotificacao.nome_equipe,
        //   dia: getDayOfWeek(Number(tokenNotificacao.dia_jogo)),
        //   hora: tokenNotificacao.hora_inicio_jogo,
        //   local: tokenNotificacao.local_jogo,
        //   codigoTime: tokenNotificacao.codigo_tim,
        //   codigoJogo: tokenNotificacao.codigo_jogo,
        //   codigoJogador: tokenNotificacao.codigo_jogador
        // })
        await axios.post(this.pushUrl, mensagem, {
          headers: {
            'Authorization': `Bearer ${beareTokenFireBase}`, 
            'Content-Type': 'application/json'
          }
        })
      }
      response.status(200).json({ message: 'Notificações enviadas com sucesso.' });
    } catch (error) {
      console.log(error)
    }
  }

  async saveToken({ request, response }: HttpContextContract) {
    const { token_ton, codigo_pessoa } = request.only(['token_ton', 'userid_ton', 'codigo_pessoa']);
    if (!token_ton) {
      return response.status(400).json({ error: 'Token é necessário' });
    }

    const existeToken = await TokenUserNotification.query().where('token_ton', token_ton).andWhere('codigo_pessoa_token', codigo_pessoa)
    if (existeToken.length == 0) {
      await TokenUserNotification.create({
        token_ton: token_ton,
        codigo_pessoa_token: codigo_pessoa
      });
      return response.status(200).json({ message: 'Token salvo com sucesso' });
    }
  }

  
  public async notificacaoConfirmarPresenca(codigoTime: number) {
    const beareTokenFireBase = await this.getAccessToken()
    try {

      const expoPushTokens = await Database.from('confirmacoes_presenca').select()
        .leftJoin(Jogador.table, 'codigo_jogador', 'codigo_jogador_confirmacao')
        .leftJoin(TokenUserNotification.table, 'codigo_pessoa_jogador', 'codigo_pessoa_token')
        .leftJoin(TimeJogador.table, 'time_jogador.codigo_jogador', 'jogador.codigo_jogador')
        .leftJoin(Time.table, 'time_jogador.codigo_time', 'codigo_tim')
        .leftJoin(JogadorJogo.table, 'codigo_jogo_confirmacao', 'jogador_jogo.codigo_jogo')
        .leftJoin(Jogo.table, 'jogador_jogo.codigo_jogo','jogo.codigo_jogo')
        .andWhere('codigo_time_jogador', codigoTime).andWhere('presenca_confirmacao', 0).andWhereNull('data_confirmacao')
      for (const tokenNotificacao of expoPushTokens) {
        if(tokenNotificacao.codigo_jogo){
        const mensagem = {
          message: {
            token: "dtuztxuoQjSTZPswytjTL-:APA91bFG8N9VXqEgg5jwghQsrpMBO5kpBKMz52-73UzSmwzSog5guwqX9qXv92UM2po03005ypztaVkNeW7EAOPwI19tZVX2XgHulVdj8GaGquk5uwjKzxXscGVzjKidB9wesUjEhNAZ",
            notification: {
              title:  `⚠️ Convocação - Time: ${tokenNotificacao.nome_tim} `,
              body:  `Você ainda não confirmou presença no jogo \nde ${getDayOfWeek(Number(tokenNotificacao.dia_jogo))}`
            },  data: {
              url: "ConfirmarPresenca",
              params: JSON.stringify({
                jogo: tokenNotificacao.nome_tim,
                equipe: tokenNotificacao.nome_equipe,
                dia: getDayOfWeek(Number(tokenNotificacao.dia_jogo)),
                hora: tokenNotificacao.hora_inicio_jogo,
                local: tokenNotificacao.local_jogo,
                codigoTime: tokenNotificacao.codigo_tim,
                codigoJogo: tokenNotificacao.codigo_jogo,
                codigoJogador: tokenNotificacao.codigo_jogador
              })
            }
          }
        }
        await axios.post(this.pushUrl, mensagem, {
          headers: {
            'Authorization': `Bearer ${beareTokenFireBase}`, 
            'Content-Type': 'application/json'
          }
        })
      }

      }

    } catch (error) {
      console.log('enviarnotificacao', error)
    }
  }

  

}
