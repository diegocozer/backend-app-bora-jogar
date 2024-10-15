import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PessoaSchema extends BaseSchema {
  protected tableName = 'pessoa'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_pes').primary()
      table.string('nomraz_pes').notNullable()
      table.string('cpfcnpj_pes').notNullable().unique()
      table.string('rgie_pes').nullable()
      table.date('datnas_pes').nullable()
      table.string('numcel_pes').nullable()
      table.string('end_pes').nullable()
      table.string('cidade_pes').nullable()
      table.string('bairro_pes').nullable()
      table.integer('numend_pes').nullable()
      table.string('cep_pes').nullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
