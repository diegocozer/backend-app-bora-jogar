import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProdutosSchema extends BaseSchema {
  protected tableName = 'produtos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_pro').primary()
      table.string('descri_pro').notNullable()
      table.integer('codcat_pro').unsigned().references('codigo_cat').inTable('categoria_produto').onDelete('CASCADE')
      table.timestamp('datins_pro').defaultTo(this.now())
      table.timestamp('datalt_pro').defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
