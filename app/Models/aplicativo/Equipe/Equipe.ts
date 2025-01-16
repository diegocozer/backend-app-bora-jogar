import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

export default class Equipe extends BaseModel {
  @column({ isPrimary: true })
  public codigo_equipe: number;

  @column()
  public nome_equipe: string;

  @column()
  public codigo_time: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoUpdate: true })
  public updatedAt: DateTime;


}
