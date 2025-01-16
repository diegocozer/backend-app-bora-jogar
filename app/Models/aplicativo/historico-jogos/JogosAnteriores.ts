import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Jogo from "../jogo/Jogo";

export default class JogoAnterior extends BaseModel {
  public static table = "jogos_anteriores";
  @column({ isPrimary: true })
  declare codigo_jogo_anterior: number;

  @column()
  declare codigo_jogo: number;

  @column.dateTime({ autoCreate: true })
  declare data_insercao: DateTime

  @hasOne(() => Jogo, {
    foreignKey: "codigo_jogo",
    localKey: "codigo_jogo",
  })
  public jogo: HasOne<typeof Jogo>;
}
