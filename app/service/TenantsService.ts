import Database from '@ioc:Adonis/Lucid/Database'
import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
import DataBaseEmp from 'App/Models/DataBaseEmp'
import Usuario from 'App/Models/Usuario'

export default class TenantsService {
  public static async add (codigo_bde: string) {
    const db = await DataBaseEmp.find(codigo_bde)
    if (!db) {
      return false
    }
    const tenantConnectionConfig = {
      client: 'mysql' as const,
      connection: {
        host: db.host,
        port: Number(db.port),
        user: db.user,
        password: db.password,
        database: db.id
      }
    }

    const connectionName = db.id
    if (!Database.manager.has(connectionName)) {
      Database.manager.add(connectionName, tenantConnectionConfig)
      Database.manager.connect(connectionName)
    }

    return true
  }

  public static async connect (userEmail: string, Model: LucidModel): Promise<LucidModel> {
    const databaseUser = await Usuario.findByOrFail('login_usu', userEmail)

    Model.connection = databaseUser.bancodedados

    return Model
  }
}
