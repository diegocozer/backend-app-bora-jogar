import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TipoCampoSchema extends BaseSchema {
  protected tableName = 'tipos_campo'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_tipo_campo').primary()
      table.string('descricao_tipo_campo').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
