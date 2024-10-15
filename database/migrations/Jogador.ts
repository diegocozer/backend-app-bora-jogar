import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class JogadorSchema extends BaseSchema {
  protected tableName = 'jogadores'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('codigo_jogador').primary()
      table.string('nome_jogador').notNullable()
      table.string('celular_jogador').notNullable()
      table.date('data_nascimento_jogador').nullable()
      table.integer('codigo_posicao_jogador').unsigned().references('codigo_posi').inTable('posicoes').notNullable()
      table.integer('goleiro_reserva_jogador').defaultTo(0)
      table.decimal('avaliacao_comu_jogador', 5, 2).defaultTo(0)
      table.decimal('avaliacao_final_jogador', 5, 2).defaultTo(0)
      table.decimal('avaliacao_defesa_jogador', 5, 2).defaultTo(0)
      table.decimal('avaliacao_marcacao_jogador', 5, 2).defaultTo(0)
      table.decimal('avaliacao_passe_jogador', 5, 2).defaultTo(0)
      table.decimal('avaliacao_respeito_jogador', 5, 2).defaultTo(0)
      table.decimal('avaliacao_velocidade_jogador', 5, 2).defaultTo(0)
      table.decimal('avaliacao_media_jogador', 5, 2).defaultTo(0)
      table.integer('codigo_pessoa_jogador').unsigned().references('codigo_pes').inTable('pessoas').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
