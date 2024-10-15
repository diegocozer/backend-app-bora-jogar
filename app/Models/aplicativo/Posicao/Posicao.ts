import { BaseModel, belongsTo, BelongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import TiposDeCampos from "../Campo/TipoCampo";

export default class Posicao extends BaseModel {
  public static table = "posicoes";

  @column({ isPrimary: true })
  declare codigo_posi: number;

  @column()
  declare tipocam_posi: number;

  @column()
  declare nome_posi: string;

  @belongsTo(() => TiposDeCampos, {
    foreignKey: "tipocam_posi",
  })
  public tipoCampo: BelongsTo<typeof TiposDeCampos>;
}
