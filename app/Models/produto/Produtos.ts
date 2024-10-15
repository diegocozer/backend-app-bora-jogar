import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class Produto extends BaseModel {
  @column({ isPrimary: true })
  declare codigo_pro: number

  @column()
  declare descri_pro: string

  @column()
  declare codcat_pro: number



  @column.dateTime({ autoCreate: true })
  declare datins_pro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare datalt_pro: DateTime
}
