import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Produto from './Produtos'

export default class Categoria extends BaseModel {
  @column({ isPrimary: true })
  declare codigo_cat: number

  @column()
  declare descri_cat: string

  @hasMany(() => Produto ,{
    foreignKey: 'codcat_pro' 
  })
  public produto: HasMany<typeof Produto>

  @column.dateTime({ autoCreate: true })
  declare datins_cat: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare datalt_cat: DateTime
}
