import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Pessoa from '../Pessoa'
import Usuario from '../Usuario'

export default class TokenUserNotification extends BaseModel {
  public static table = 'tokenusuarionotificacao'
  @column({ isPrimary: true })
  declare codigo_ton: number

  @column()
  declare token_ton: string

  @column()
  declare codigo_pessoa_token: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasOne(() => Pessoa, {
    foreignKey: 'codigo_pes',
    localKey: 'codigo_pessoa_token'
  })
  declare pessoa: HasOne<typeof Pessoa>

  @belongsTo(() => Usuario)
  declare user: BelongsTo<typeof Usuario>
}
