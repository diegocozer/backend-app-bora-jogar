// app/Models/JogadorEquipe.ts
import { BaseModel, belongsTo, BelongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Jogador from "../Cadastros/Jogador";
import Posicao from "../Posicao/Posicao";
import Equipe from "./Equipe";

export default class JogadorEquipe extends BaseModel {
  @column({ isPrimary: true })
  public codigo_jogador_equipe: number;

  @column()
  public nome_jogador_equipe: string;

  @column()
  public posicao_jogador_equipe: number;

  @column()
  public codigo_equipe: number;

  @column()
  public goleiro_reserva_equipe: boolean;

  @column()
  public reserva_jogador_equipe: boolean;
  @column()
  public jogador_equipe: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Equipe, {
    foreignKey: "codigo_equipe",
    localKey: "codigo_equipe"
  })
  public equipe: BelongsTo<typeof Equipe>;
  @belongsTo(() => Jogador, {
    foreignKey: "codigo_jogador",
    localKey: "codigo_jogador"
  })
  public jogador: BelongsTo<typeof Jogador>;

  @belongsTo(() => Posicao, {
    foreignKey: "codigo_posi",
    localKey:'posicao_jogador_equipe'
  })
  public posicao: BelongsTo<typeof Posicao>;
}
