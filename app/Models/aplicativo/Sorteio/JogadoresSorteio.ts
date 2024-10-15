import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm';
import Jogador from '../Cadastros/Jogador';
import Equipe from '../Equipe/Equipe';
import Jogo from '../jogo/Jogo';

export default class JogadoresSorteio extends BaseModel {
  public static table = 'jogadores_sorteio'
  @column({ isPrimary: true })
  public codigo_jogador_sorteio: number

  @column()
  public nome_jogador: string

  @column()
  public avaliacao_media_jogador: number

  @column()
  public goleiro_reserva_jogador: boolean

  @column()
  public isGoleiro: boolean
  @column()
  public isReserva: boolean
  @column()
  public pontuacao: number

  @column()
  public codigo_jogo: number
  @column()
  public codigo_equipe: number
  @column()
  public codigo_jogador: number
  @hasOne(() => Jogo, {
    foreignKey: "codigo_tim",
    localKey: 'codigo_jogo'
  })
  public jogo: HasOne<typeof Jogo>;
  @hasOne(() => Jogador, {
    foreignKey: "codigo_jogador",
    localKey: 'codigo_jogador'
  })
  public jogador: HasOne<typeof Jogador>;
  @hasOne(() => Equipe, {
    foreignKey: "codigo_equipe",
    localKey: 'codigo_equipe'
  })
  public equipe: HasOne<typeof Equipe>;

}
