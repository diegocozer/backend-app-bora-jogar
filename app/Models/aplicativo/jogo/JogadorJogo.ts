import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Jogador from '../Cadastros/Jogador'
import Time from '../Cadastros/Time'
import Jogo from './Jogo'

export default class JogadorJogo extends BaseModel {
    public static table = 'jogador_jogo'
    @column({ isPrimary: true })
    declare codigo_jogador_jogo: number

    @column()
    declare codigo_jogador: number

    @column()
    declare codigo_time: number
    @column()
    declare codigo_jogo: number


    @hasOne(() => Time, {
        foreignKey: 'codigo_tim',
        localKey: 'codigo_time'
    })
    public times: HasOne<typeof Time>

    @hasOne(() => Jogador, {
        foreignKey: 'codigo_jogador',
        localKey: 'codigo_jogador'
    })
    public jogador: HasOne<typeof Jogador>
    @hasOne(() => Jogo, {
        foreignKey: 'codigo_jogo',
        localKey: 'codigo_jogo'
    })
    public jogo: HasOne<typeof Jogo>






}
