import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class Pessoa extends BaseModel {
  @column({ isPrimary: true })
  declare codigo_pes: number

  @column()
  declare nomraz_pes: string

  @column({ isPrimary: true })
  declare cpfcnpj_pes: string

  @column()
  declare rgie_pes: string | null
  @column()
  declare datnas_pes: string | null

  @column()
  declare numcel_pes: string | null

  @column()
  declare end_pes: string | null

  @column()
  declare cidade_pes: string | null

  @column()
  declare bairro_pes: string | null

  @column()
  declare numend_pes: number | null

  @column()
  declare cep_pes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
