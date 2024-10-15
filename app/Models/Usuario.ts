import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, BelongsTo, HasMany, HasOne, beforeSave, belongsTo, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import ApiToken from './ApiToken'
import Pessoa from './Pessoa'
import Time from './aplicativo/Cadastros/Time'

// const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
//   uids: ['login_usu'],
//   passwordColumnName: 'senha_usu',
// })

export default class Usuario extends BaseModel {
  
  @column({ isPrimary: true })
  declare codigo_usu: number

  @column({ isPrimary: true })
  declare login_usu: string

  @column()
  declare codpes_usu: number

  @column()
  declare bancodedados: string

  @column({ isPrimary: true })
  declare celular_usu: string
  @column()
  declare primeiro_acesso_usuario: boolean

  @column()
  declare time_usu: string

  @column()
  declare email_usu: string

  @column()
  declare nompes_usu: string

  @belongsTo(() => Time, { foreignKey: 'codigo_tim', localKey: 'time_usu' })
  public time: BelongsTo<typeof Time>

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasOne(() => Pessoa ,{
    foreignKey: 'codigo_pes',
    localKey: 'codpes_usu'
  })
  public pessoas: HasOne<typeof Pessoa>

  @hasMany(() => ApiToken, {
    foreignKey: 'user_id', // Nome da chave estrangeira no modelo Token
  })
  public tokens: HasMany<typeof ApiToken>

  @beforeSave()
  public static async hashPassword (user: Usuario) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  // static accessTokens = DbAccessTokensProvider.forModel(Usuario)
}
