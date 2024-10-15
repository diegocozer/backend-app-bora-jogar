import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StatusSchema extends BaseSchema {
  protected tableName = 'status'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_sta').primary()
      table.string('descri_sta').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
