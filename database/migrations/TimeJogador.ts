import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TimeJogadorSchema extends BaseSchema {
  protected tableName = 'time_jogadores'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_tj').primary()
      table.integer('codigo_tim').unsigned().references('codigo_tim').inTable('times').onDelete('CASCADE')
      table.integer('codigo_jogador').unsigned().references('codigo_jogador').inTable('jogadores').onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
