import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import HistoricoJogador from '../historico_jogador/HistoricoJogador'

export default class GolsJogadores extends BaseModel {
    @column({ isPrimary: true })
    public codigo_gols_jogadores: number

    @column()
    public quantidade_gol: number

    @column()
    public codigo_historico_jogador: number

    @belongsTo(() => HistoricoJogador, {
        foreignKey: 'codigo_historico_jogador'
    })
    public historicoJogador: BelongsTo<typeof HistoricoJogador>


}
