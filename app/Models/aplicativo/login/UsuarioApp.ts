import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, BelongsTo, beforeSave, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Pessoa from 'App/Models/Pessoa'
import { DateTime } from 'luxon'
import Time from '../Cadastros/Time'

// const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
//   uids: ['login_usu'],
//   passwordColumnName: 'senha_usu',
// })

export default class UsuarioApp extends BaseModel {
  
  @column({ isPrimary: true })
  declare codigo_usu: number

  @column({ isPrimary: true })
  declare login_usu: string

  @column({ isPrimary: true })
  declare time_usu: string

  @column()
  declare codpes_usu: number


  @belongsTo(() => Pessoa, { foreignKey: 'codigo_pes' })
  public pessoa: BelongsTo<typeof Pessoa>

  @belongsTo(() => Time, { foreignKey: 'codigo_tim' })
  public campo: BelongsTo<typeof Time>


  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: UsuarioApp) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  // static accessTokens = DbAccessTokensProvider.forModel(Usuario)
}
