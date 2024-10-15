import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
export default class DataBaseEmp extends BaseModel {
    public static table = 'databaseemp'

    @column({ columnName: 'codigo_bde', isPrimary: true })
    public id: string
  
    @column({ columnName: 'host_bde' })
    public host: string
  
    @column({ columnName: 'porta_bde' })
    public port: string
  
    @column({ columnName: 'login_bde' })
    public user: string
  
    @column({ columnName: 'senha_bde', serializeAs: null })
    public password: string
  
    @column({ columnName: 'obs_bde' })
    public note: string
  
    @column({ columnName: 'name_bde' })
    public name: string
  
}
