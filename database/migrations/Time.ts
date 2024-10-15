import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TimeSchema extends BaseSchema {
  protected tableName = 'times'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_tim').primary()
      table.string('nome_tim').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
