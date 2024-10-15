import { BaseModel, column, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import Posicao from "../Posicao/Posicao";

export default class TiposDeCampos extends BaseModel {
  public static table = "tipos_de_campos";

  @column({ isPrimary: true })
  declare codigo_tcamp: number;

  @column()
  declare nome_tcamp: string;

  @hasMany(() => Posicao, {
    foreignKey: "tipocam_posi",
  })
  public posicoes: HasMany<typeof Posicao>;
}
