import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import OrdemComanda from './OrdemComanda'
import Status from './Status'

export default class Comanda extends BaseModel {
      public static table = 'comanda'
  @column({ isPrimary: true })
  declare codigo_com: number

  @column()
  declare numero_com: number

  @column()
  declare codsta_com: number

  @hasMany(() => Status ,{
    foreignKey: 'codigo_sta' 
  })
  public status: HasMany<typeof Status>

  @hasMany(() => OrdemComanda ,{
    foreignKey: 'codcom_ocm' 
  })
  public ordemComanda: HasMany<typeof OrdemComanda>




}
