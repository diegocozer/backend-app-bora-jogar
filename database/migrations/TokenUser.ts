import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TokenUserNotificationSchema extends BaseSchema {
  protected tableName = 'tokenusuarionotificacao'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_ton').primary()
      table.string('token_ton').notNullable()
      table.integer('codigo_pessoa_token').unsigned().references('codigo_pes').inTable('pessoa').onDelete('CASCADE')
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
