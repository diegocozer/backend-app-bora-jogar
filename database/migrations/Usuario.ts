import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsuarioSchema extends BaseSchema {
  protected tableName = 'usuarios'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_usu').primary()
      table.string('login_usu').notNullable().unique()
      table.integer('codpes_usu').unsigned().references('codigo_pes').inTable('pessoa').onDelete('CASCADE')
      table.string('bancodedados').notNullable()
      table.string('celular_usu').notNullable()
      table.string('time_usu').notNullable()
      table.string('email_usu').notNullable().unique()
      table.string('nompes_usu').notNullable()
      table.string('password').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
