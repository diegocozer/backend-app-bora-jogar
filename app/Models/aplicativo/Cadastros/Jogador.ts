import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Pessoa from 'App/Models/Pessoa'
import Posicao from '../Posicao/Posicao'

export default class Jogador extends BaseModel {
  public static table = 'jogador'
  @column({ isPrimary: true })
  declare codigo_jogador: number

  @column()
  declare nome_jogador: string
  @column()
  declare celular_jogador: string

  @column()
  declare data_nascimento_jogador: string | null

  @column()
  declare codigo_posicao_jogador: number
  @column()
  declare goleiro_reserva_jogador: number

  @column()
  declare avaliacao_comu_jogador: number
  //Finalização
  @column()
  declare avaliacao_final_jogador: number
  // Goleiro
  @column()
  declare avaliacao_defesa_jogador: number
  //Marcação
  @column()
  declare avaliacao_marcacao_jogador: number
  //Passe
  @column()
  declare avaliacao_passe_jogador: number
  //Respeito
  @column()
  declare avaliacao_respeito_jogador: number
  //Velocidade
  @column()
  declare avaliacao_velocidade_jogador: number
  @column()
  declare codigo_pessoa_jogador: number
  //Média avaliação
  @column()
  declare avaliacao_media_jogador: number
  //Média avaliação
  @column()
  declare foto_jogador: string

  @belongsTo(() => Pessoa, { foreignKey: 'codigo_pes', localKey: 'codigo_pessoa_jogador' })
  public Pessoa: BelongsTo<typeof Pessoa>

  @hasOne(() => Posicao, {
    foreignKey: 'codigo_posi',
    localKey: 'codigo_posicao_jogador'
  })
  public posicao: HasOne<typeof Posicao>

}
