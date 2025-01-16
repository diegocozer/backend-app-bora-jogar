import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Jogador from '../Cadastros/Jogador'
import Time from '../Cadastros/Time'

export default class Notificacoes extends BaseModel {
    public static table = 'notificacao'
    @column({ isPrimary: true })
    declare codigo_notificacao: number

    @column()
    declare label_notificacao: string
    @column()
    declare visualizada_notificacao: boolean

    @column()
    declare codigo_jogador_notificacao: number | null
    @column()
    declare codigo_time_notificacao: number
    @column()
    declare jogo_notificacao: string

    @hasOne(() => Time, {
        foreignKey: 'codigo_tim',
        localKey: 'codigo_time_notificacao'
    })
    public times: HasOne<typeof Time>

    @hasOne(() => Jogador, {
        foreignKey: 'codigo_jogador',
        localKey: 'codigo_jogador_notificacao'
    })
    public jogador: HasOne<typeof Jogador>





}
