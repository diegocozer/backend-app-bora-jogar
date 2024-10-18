import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Usuario from 'App/Models/Usuario'

export default class Time extends BaseModel {
  public static table = 'time'
  @column({ isPrimary: true })
  declare codigo_tim: number

  @column()
  declare nome_tim: number

  @column()
  declare pres_tim: number

  @column()
  declare escudo_tim: string

  @hasOne(() => Usuario, {
    foreignKey: 'codigo_usu',
    localKey: 'pres_tim'
  })
  public presidente: HasOne<typeof Usuario>






}
