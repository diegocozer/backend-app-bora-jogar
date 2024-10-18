import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class DiaSemana extends BaseModel {
    public static table = 'dia_semana'

    @column({ isPrimary: true })
    public codigo_dia: number

    @column()
    public codigo_semana_dia: number

    @column()
    public nome_dia: string
}
