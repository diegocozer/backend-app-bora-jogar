import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Equipe from '../Equipe/Equipe'
import HistoricoJogo from '../historico-jogo/HistoricoJogo'

export default class PlacarJogo extends BaseModel {
    public static table = 'placar_jogo'
    @column({ isPrimary: true })
    public codigo_placar_jogo: number

    @column()
    public codigo_historico_jogo: number

    @column()
    public codigo_equipe: number

    @column()
    public placar_jogo: number
    @column()
    public nome_equipe: string

    @belongsTo(() => HistoricoJogo, {
        foreignKey: 'codigo_historico_jogo'
    })
    public jogo: BelongsTo<typeof HistoricoJogo>

    @belongsTo(() => Equipe, {
        foreignKey: 'codigo_equipe'
    })
    public equipe: BelongsTo<typeof Equipe>

    @column.dateTime({ autoCreate: true })
    public data_insercao: DateTime
}
