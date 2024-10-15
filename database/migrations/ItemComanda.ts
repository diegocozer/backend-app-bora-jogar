import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ItemComandaSchema extends BaseSchema {
  protected tableName = 'itemcomanda'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_itc').primary()
      table.integer('ordem_itc').notNullable()
      table.integer('produto_itc').unsigned().references('codigo_pro').inTable('produtos').onDelete('CASCADE')
      table.integer('quantidade_itc').notNullable()
      table.decimal('preco_itc', 10, 2).notNullable()
      table.timestamp('created_at').defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
