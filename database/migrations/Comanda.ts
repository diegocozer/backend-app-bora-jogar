import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ComandaSchema extends BaseSchema {
  protected tableName = 'comanda'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_com').primary()
      table.integer('numero_com').notNullable()
      table.integer('codsta_com').unsigned().references('codigo_sta').inTable('status').onDelete('CASCADE')
      table.timestamp('created_at').defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
