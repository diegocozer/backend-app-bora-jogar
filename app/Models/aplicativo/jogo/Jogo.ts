import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Time from '../Cadastros/Time'
import ConfirmarPresenca from '../confirma-presenca/ConfirmarPresenca'
import JogadoresSorteio from '../Sorteio/JogadoresSorteio'

export default class Jogo extends BaseModel {
    public static table = 'jogo'
    @column({ isPrimary: true })
    declare codigo_jogo: number

    @column()
    declare codigo_time_jogo: number

    @column()
    declare dia_jogo: string

    @column()
    declare hora_inicio_jogo: number

    @column()
    declare hora_final_jogo: number

    @column()
    declare local_jogo: string

    @column()
    declare endereco_jogo: string

    @column()
    declare urlmaps_jogo: string


    @column()
    declare mensal_jogo: boolean

    @column()
    declare tipo_campo: number

    @column()
    declare status_jogo: string


    @hasOne(() => JogadoresSorteio, {
        foreignKey: 'codigo_jogo',
        localKey: 'codigo_jogo'
    })
    public sorteio: HasOne<typeof JogadoresSorteio>

    @hasOne(() => Time, {
        foreignKey: 'codigo_tim',
        localKey: 'codigo_time_jogo'
    })
    public times: HasOne<typeof Time>

    @hasOne(() => ConfirmarPresenca, {
        foreignKey: 'codigo_jogo_confirmacao',
        localKey: 'codigo_jogo'
    })
    public confirmado: HasOne<typeof ConfirmarPresenca>

}
