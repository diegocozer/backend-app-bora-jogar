import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import ItemComanda from './ItemComanda'

export default class OrdemComanda extends BaseModel {
          public static table = 'OrdemComanda'
  @column({ isPrimary: true })
  declare codigo_ocm: number

  @column()
  declare codcom_ocm: number

  @column.dateTime({ autoCreate: true })
  declare datins_ocm: DateTime

  @hasMany(() => ItemComanda ,{
    foreignKey: 'ordem_itc' 
  })
  public itemComanda: HasMany<typeof ItemComanda>


  

}
