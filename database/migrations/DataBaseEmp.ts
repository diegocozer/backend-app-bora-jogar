import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DataBaseEmpSchema extends BaseSchema {
  protected tableName = 'databaseemp'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_bde').primary()
      table.string('host_bde').notNullable()
      table.string('porta_bde').notNullable()
      table.string('login_bde').notNullable()
      table.string('senha_bde').notNullable()
      table.string('obs_bde').nullable()
      table.string('name_bde').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
