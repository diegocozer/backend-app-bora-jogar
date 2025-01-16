import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class AvaliacaoJogador extends BaseModel {
    public static table = 'avaliacao_jogador'
    @column({ isPrimary: true })
    public codigo_avaliacao: number

    @column()
    public velocidade_avaliacao: number

    @column()
    public defesa_avaliacao: number

    @column()
    public passe_avaliacao: number

    @column()
    public marcacao_avaliacao: number

    @column()
    public respeito_avaliacao: number

}
