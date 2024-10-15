import { AuthConfig } from '@ioc:Adonis/Addons/Auth'

const authConfig: AuthConfig = {
  guard: 'api',
  guards: {
    api: {
      driver: 'oat',
      tokenProvider: {
        driver: 'database',
        table: 'api_tokens'
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'codigo_usu',
        uids: ['login_usu'],
        model: () => import('App/Models/Usuario'),
      }
    }
  }
}

export default authConfig
