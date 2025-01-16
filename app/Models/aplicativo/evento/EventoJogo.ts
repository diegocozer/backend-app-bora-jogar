import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Time from '../Cadastros/Time'
import Jogo from '../jogo/Jogo'

export default class EventosJogo extends BaseModel {
  public static table = 'eventos_jogo'
  @column({ isPrimary: true })
  public codigo_evento: number

  @column()
  public titulo_evento: string | null

  @column()
  public assunto_evento: string | null

  @column()
  public evento_evento: boolean | null

  @column()
  public data_evento: string | null

  @column()
  public hora_evento: string | null

  @column()
  public jogo_evento: string | null

  @column()
  public local_evento: string | null

  @column()
  public rateado_evento: boolean | null

  @column()
  public codigo_jogo_evento: number
  @column()
  public codigo_time_evento: number

  @hasOne(() => Jogo, {
    foreignKey: 'codigo_jogo',
    localKey: 'codigo_jogo_evento'
  })
  public jogo: HasOne<typeof Jogo>
  @hasOne(() => Time, {
    foreignKey: 'codigo_tim',
    localKey: 'codigo_time_evento'
  })
  public time: HasOne<typeof Time>
}
