import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Jogador from './Jogador'
import Time from './Time'

export default class TimeJogador extends BaseModel {
    public static table = 'time_jogador'
    @column({ isPrimary: true })
    declare codigo_jogador_time: number

    @column()
    declare codigo_jogador: number

    @column()
    declare codigo_time: number

    @column()
    declare convite_time: boolean

    @column()
    declare ativo_time: boolean | null

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

}
