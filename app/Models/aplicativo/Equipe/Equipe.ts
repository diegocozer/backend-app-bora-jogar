import { BaseModel, column, HasOne, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Time from "../Cadastros/Time";

export default class Equipe extends BaseModel {
  @column({ isPrimary: true })
  public codigo_equipe: number;

  @column()
  public nome_equipe: string;

  @column()
  public codigo_time: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoUpdate: true })
  public updatedAt: DateTime;

  @hasOne(() => Time, {
    foreignKey: "codigo_tim",
    localKey:'codigo_time'
  })
  public time: HasOne<typeof Time>;
}
