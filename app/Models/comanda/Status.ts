import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Status extends BaseModel {
  @column({ isPrimary: true })
  declare codigo_sta: number

  @column()
  declare descri_sta: string

}
