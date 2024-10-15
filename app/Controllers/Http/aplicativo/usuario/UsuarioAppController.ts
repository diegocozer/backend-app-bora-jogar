import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Jogador from 'App/Models/aplicativo/Cadastros/Jogador'
import Pessoa from 'App/Models/Pessoa'
import Usuario from 'App/Models/Usuario'


export default class UsuariosController {

  public async index({ }: HttpContextContract) { }

  public async logoutApp({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke()
    return response.json({ message: 'Deslogado' })
  }


  async loginApp({ request, auth, response }: HttpContextContract) {
    const { login_usu, password } = request.only(['login_usu', 'password'])
    try {
      await auth.use('api').attempt(login_usu, password)

      const usuario = await Usuario.query().where('login_usu', login_usu).preload('pessoas').firstOrFail()
      if(usuario.primeiro_acesso_usuario){
        usuario.primeiro_acesso_usuario = false
        usuario.save()
      }
    
      const jogador = await Jogador.query().where('codigo_pessoa_jogador', usuario.pessoas?.codigo_pes).first()
      if (!usuario.$attributes.codigo_usu) {
        return response.status(204).json({ message: "Usuário inexistente" })
      }
      const authData = await auth.use('api').generate(usuario, {
        expiresIn: '30 days',
      })


      return response.status(200).json({
        token: authData.token,
        usuario: {
          codigo_usu: usuario.$attributes.codigo_usu,
          codigo_tim: usuario.time_usu,
          nome_pessoa: usuario.pessoas?.nomraz_pes,
          codigo_pessoa: usuario.pessoas?.codigo_pes,
          codigo_jogador: jogador?.$attributes.codigo_jogador,
          celular_usuario: usuario?.$attributes.celular_usu
        }

      })

    } catch (error) {
      console.log(error)
      if (error.message.includes('E_INVALID_AUTH_PASSWORD')) {
        return response.status(401).json({ message: "Senha inválida" })
      }
      return response.internalServerError('Erro interno do servidor', true)
    }
  }


  public async createUsuarioApp({ request, response }: HttpContextContract) {
    const trx = await Database.transaction()

    try {
      const { login_usu, password, email_usu, celular_usu, nomraz_pes } = request.only([
        'login_usu',
        'password',
        'email_usu',
        'celular_usu',
        'nomraz_pes',
      ])

      const usuarioExistente = await Usuario.query({ client: trx }).where('login_usu', login_usu).first()
      const emailExistente = await Usuario.query({ client: trx }).where('email_usu', email_usu).first()
      const celularExistente = await Usuario.query({ client: trx }).where('celular_usu', celular_usu).first()

      if (usuarioExistente) {
        await trx.rollback()
        return response.status(402).json({ message: 'Já existe um usuário com esse nome de usuário!' })
      }

      if (celularExistente) {
        await trx.rollback()
        return response.status(402).json({ message: 'Já existe um usuário com esse número de celular!' })
      }

      if (emailExistente) {
        await trx.rollback()
        return response.status(402).json({ message: 'Já existe um usuário com esse e-mail!' })
      }
      let pessoa = await Pessoa.findBy('numcel_pes', celular_usu)

      if (!pessoa) {

        let pessoa = await Pessoa.create({
          nomraz_pes: nomraz_pes,
          numcel_pes: celular_usu
        })

        pessoa.save()
      }
      
        const pessoaRecuperada = await Pessoa.query()
          .where('nomraz_pes', nomraz_pes)
          .andWhere('numcel_pes', celular_usu)
          .first()

      const user = await Usuario.create({
        login_usu: login_usu,
        password: password,
        email_usu: email_usu,
        celular_usu: celular_usu,
        codpes_usu:  pessoaRecuperada?.codigo_pes,
      }, { client: trx })

      await trx.commit()

      return response.status(200).json({ data: user, message: 'Usuário criado com sucesso!' })

    } catch (error) {
      console.log(error)
      await trx.rollback()
      return response.status(500).json({ message: 'Erro ao criar usuário', error: error.message })
    }
  }


  public async show({ }: HttpContextContract) { }

  public async updateUsuarioApp({ request }: HttpContextContract) {
    try {
      const { codigoUsu } = request.params()
      const senha = request.only(['senha'])
      const usuario = await Usuario.findByOrFail('codigo_usu', codigoUsu)
      await usuario.merge({ password: String(senha) }).save()
    } catch (error) {

    }
  }

  public async destroy({ }: HttpContextContract) { }
}
