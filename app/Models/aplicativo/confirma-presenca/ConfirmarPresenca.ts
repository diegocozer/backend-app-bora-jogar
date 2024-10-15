import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Jogador from '../Cadastros/Jogador'
import Jogo from '../jogo/Jogo'

export default class ConfirmarPresenca extends BaseModel {
    public static table = 'confirmacoes_presenca'
    @column({ isPrimary: true })
    declare codigo_confirmacao: number

    @column()
    declare codigo_jogador_confirmacao: number
    @column()
    declare codigo_jogo_confirmacao: number

    @column()
    declare presenca_confirmacao: boolean

    @column()
    declare data_confirmacao: DateTime | null

    @hasMany(() => Jogo, {
        foreignKey: 'codigo_jogo',
        localKey: 'codigo_jogo_confirmacao'
    })
    public jogo: HasMany<typeof Jogo>

    @hasMany(() => Jogador, {
        foreignKey: 'codigo_jogador',
        localKey: 'codigo_jogador_confirmacao'
    })
    public jogador: HasMany<typeof Jogador>






}
