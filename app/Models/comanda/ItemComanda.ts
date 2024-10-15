import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Produto from '../produto/Produtos'

export default class ItemComanda extends BaseModel {
          public static table = 'ItemComanda'
  @column({ isPrimary: true })
  declare codigo_itc: number

  @column()
  declare ordem_itc: number
  @column()

  declare produto_itc: number
  @column()
  declare quantidade_itc: number

  @column()
  declare preco_itc: number

  @hasOne(() => Produto, {
    foreignKey: 'codigo_pro', // Chave na tabela Produto
    localKey: 'produto_itc',  // Chave local na tabela ItemComanda
  })
  public produto: HasOne<typeof Produto>





}
