import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Pessoa from "App/Models/Pessoa";

export default class PessoasController {
  async insertOrUpdate({ request }: HttpContextContract) {
    const body = request.body()

    const pessoa = await Pessoa.create(body)
    return {
      msg: 'Pessoa criada com sucesso!',
      data: pessoa,
    }
  }
}
