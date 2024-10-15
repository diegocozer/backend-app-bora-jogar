import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, BelongsTo, beforeSave, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class DatabaseUser extends BaseModel {
  public static table = 'usuario'

  @column({ columnName: 'codigo_usu', isPrimary: true })
  public id: number

  @column({ columnName: 'login_usu' })
  public email: string

  @column({ columnName: 'senha_usu', serializeAs: null })
  public password: string

  @column({ columnName: 'prinom_usu' })
  public firstName: string

  @column({ columnName: 'meinom_usu' })
  public middleName: string

  @column({ columnName: 'sobnom_usu' })
  public lastName: string

  @column({ columnName: 'codban_usu' })
  public userDatabaseId: string

  @belongsTo(() => UserDatabase)
  public userDatabase: BelongsTo<typeof UserDatabase>

  public usuarioLogado: Usuario
  public empresaLogada: Empresa
  public database: string

  @beforeSave()
  public static async hashPassword (user: DatabaseUser) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
