import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Jogo from '../jogo/Jogo'
import PlacarJogo from '../placar-jogo/PlacarJogo'

export default class HistoricoJogo extends BaseModel {
    public static table = 'historico_jogo'
    @column({ isPrimary: true })
    public codigo_historico_jogo: number

    @column()
    public codigo_jogo: number

    @column.date()
    public data_jogo: DateTime

    @column()
    public codigo_placar: number | null

    @hasMany(() => PlacarJogo, {
        foreignKey: 'codigo_historico_jogo'
    })
    public placar: HasMany<typeof PlacarJogo>

    @hasMany(() => Jogo, {
        foreignKey: 'codigo_jogo',
        localKey: 'codigo_jogo'
    })
    public jogo: HasMany<typeof Jogo>

}
