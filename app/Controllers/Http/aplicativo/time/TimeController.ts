import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Jogador from 'App/Models/aplicativo/Cadastros/Jogador';
import Time from 'App/Models/aplicativo/Cadastros/Time';
import TimeJogador from 'App/Models/aplicativo/Cadastros/TimeJogador';
import Equipe from 'App/Models/aplicativo/Equipe/Equipe';


export default class CadastrarTimeController {
  public async insertOrUpdate({ request, response }: HttpContextContract) {
    const trx = await Database.transaction()
    try {
      const body = request.only(['nome_tim', 'pres_tim', 'tipo_campo', 'qtdjo_tim', 'dnot_tim', 'escudo_tim'])
      const { nome_equipe1, nome_equipe2 } = request.only(['nome_equipe1', 'nome_equipe2'])
      const { codigo_pessoa_jogador } = request.only(['codigo_pessoa_jogador'])

      // Define escudo padrão, caso não fornecido
      if (!body.escudo_tim) {
        body.escudo_tim = ''
      }

      // Verifica se o jogador é um presidente válido
      const jogadorPresidente = await Jogador.findBy('codigo_pessoa_jogador', codigo_pessoa_jogador)
      if (!jogadorPresidente?.codigo_jogador) {
        return response.status(202).json({ msg: 'Você ainda não foi cadastrado como jogador!' })
      }

      let msg
      let time = await Time.query({ client: trx })
        .where('nome_tim', body.nome_tim)
        .andWhere('pres_tim', body.pres_tim)
        .first()

      if (time) {
        // Time já existe, atualiza os dados e equipes associadas
        time.merge(body)
        await time.useTransaction(trx).save()

        const equipesExistentes = await Equipe.query({ client: trx }).where('codigo_time', time.codigo_tim)

        if (equipesExistentes.length > 0) {
          // Atualiza nomes das equipes
          equipesExistentes[0].merge({ nome_equipe: nome_equipe1 })
          equipesExistentes[1].merge({ nome_equipe: nome_equipe2 })
          await Promise.all(equipesExistentes.map((equipe) => equipe.save()))
        } else {
          // Cria as equipes, caso não existam
          await Equipe.createMany([
            { nome_equipe: nome_equipe1, codigo_time: time.codigo_tim },
            { nome_equipe: nome_equipe2, codigo_time: time.codigo_tim },
          ], { client: trx })
        }

        msg = 'Time atualizado com sucesso!'
      } else {
        // Cria o novo time e as equipes associadas
        time = await Time.create(body, { client: trx })

        await TimeJogador.create({
          codigo_jogador: jogadorPresidente.codigo_jogador,
          codigo_time: time.codigo_tim,
          ativo_time: true,
          convite_time: true,
        }, { client: trx })

        await Equipe.createMany([
          { nome_equipe: nome_equipe1, codigo_time: time.codigo_tim },
          { nome_equipe: nome_equipe2, codigo_time: time.codigo_tim },
        ], { client: trx })

        msg = 'Time criado com sucesso!'
      }

      // Finaliza a transação
      await trx.commit()
      return response.status(201).json({ msg, data: time })
    } catch (error) {
      console.error('Erro durante a operação:', error)
      await trx.rollback()
      return response.status(500).json({ msg: 'Ocorreu um erro ao processar a requisição', error: error.message })
    }
  }



  public async getTime({ params }: HttpContextContract) {
    const timeJogador = await TimeJogador.query().select().where('codigo_jogador', params.codigoJog).preload('times')
    return timeJogador
  }
  public async getTimePresi({ params }: HttpContextContract) {
    const time = await Time.query().select().where('pres_tim', params.pres_tim).preload('equipes')
    return time
  }

}
