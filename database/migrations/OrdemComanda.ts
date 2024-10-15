import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OrdemComandaSchema extends BaseSchema {
  protected tableName = 'ordemcomanda'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_ocm').primary()
      table.integer('codcom_ocm').unsigned().references('codigo_com').inTable('comanda').onDelete('CASCADE')
      table.timestamp('datins_ocm').defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
