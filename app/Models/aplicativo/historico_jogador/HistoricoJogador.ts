import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import AvaliacaoJogador from '../avaliacao-jogador/AvaliacaoJogador'
import Jogador from '../Cadastros/Jogador'
import Equipe from '../Equipe/Equipe'
import HistoricoJogo from '../historico-jogo/HistoricoJogo'

export default class HistoricoJogador extends BaseModel {
    public static table = 'historico_jogador'
    @column({ isPrimary: true })
    public codigo_historico_jogador: number

    @column()
    public codigo_historico_jogo: number

    @column()
    public codigo_jogador: number

    @column()
    public goleiro: boolean

    @column()
    public codigo_avaliacao: number | null

    @column.date()
    public data_insercao: DateTime

    @column()
    public codigo_equipe: number | null
    @column()
    public gols_partida: number | null

    @belongsTo(() => HistoricoJogo, {
        foreignKey: 'codigo_historico_jogo'
    })
    public historicoJogo: BelongsTo<typeof HistoricoJogo>

    @belongsTo(() => Equipe, {
        foreignKey: 'codigo_equipe'
    })
    public equipe: BelongsTo<typeof Equipe>

    @belongsTo(() => AvaliacaoJogador, {
        foreignKey: 'codigo_avaliacao'
    })
    public avaliacao: BelongsTo<typeof AvaliacaoJogador>
    @belongsTo(() => Jogador, {
        foreignKey: 'codigo_jogador'
    })
    public jogador: BelongsTo<typeof Jogador>
}
