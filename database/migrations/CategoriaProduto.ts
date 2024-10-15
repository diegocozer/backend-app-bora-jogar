import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CategoriaProdutoSchema extends BaseSchema {
  protected tableName = 'categoria_produto'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_cat').primary()
      table.string('descri_cat').notNullable()
      table.timestamp('datins_cat').defaultTo(this.now())
      table.timestamp('datalt_cat').defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
