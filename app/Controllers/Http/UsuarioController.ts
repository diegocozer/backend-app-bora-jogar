import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from 'App/Models/Usuario'
import TokenUserNotification from 'App/Models/aplicativo/TokenUser'
import Comanda from 'App/Models/comanda/Comanda'
import ItemComanda from 'App/Models/comanda/ItemComanda'
import OrdemComanda from 'App/Models/comanda/OrdemComanda'
import CategoriaProd from 'App/Models/produto/CategoriaProduto'
import Produto from 'App/Models/produto/Produtos'
import TenantsService from 'App/service/TenantsService'

export default class UsuariosController {

  public async index({}: HttpContextContract) {}


  async loginApp({ request, auth, response }: HttpContextContract) {
    const body  = request.body()
    await auth.use('api').attempt(body.usuario, body.senha)
    try {
      const usuario = await Usuario.query()
      .where('login_usu', body.usuario)
      .firstOrFail()
      const authData = await auth.use('api').generate(usuario, {
      codigoTime: usuario.bancodedados,
      expiresIn: '1 day'
    })
      
      return { token: authData.token} 
    } catch (error) {
      return response.unauthorized('Invalid credentials')
    }
  }
  async login({ request, auth, response }: HttpContextContract) {
    const body  = request.body()
    await auth.use('api').attempt(body.usuario, body.senha)
    try {
      const usuario = await Usuario.query()
      .where('login_usu', body.usuario)
      .firstOrFail()
      const authData = await auth.use('api').generate(usuario, {
      codigo_ban: usuario.bancodedados,
      expiresIn: '1 day'
    })
      
      await TenantsService.add(usuario.bancodedados)
      CategoriaProd.connection = usuario.bancodedados
      Produto.connection = usuario.bancodedados
      Comanda.connection = usuario.bancodedados
      OrdemComanda.connection = usuario.bancodedados
      ItemComanda.connection = usuario.bancodedados
      TokenUserNotification.connection =  usuario.bancodedados
      
      return { token: authData.token} 
    } catch (error) {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async create({request}: HttpContextContract) {
    try {
      
    
    const {login, senha} = request.only(['login','senha'])
    const user = Usuario.create({
      login_usu: login,
      password: senha
  })

  return user
} catch (error) {
      
}
  }

  public async show({}: HttpContextContract) {}

  public async update({request}: HttpContextContract) {
    try {
    const {codigoUsu} = request.params()
    const senha = request.only(['senha'])
    const usuario = await Usuario.findByOrFail('codigo_usu', codigoUsu)
    await usuario.merge({ password: String(senha) } ).save()
  } catch (error) {
      
  }
  } 

  public async destroy({}: HttpContextContract) {}
}
