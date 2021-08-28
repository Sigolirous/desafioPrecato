import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Pagamento extends BaseModel {
  @column({ isPrimary: true })
  public idRemessa: number

  @column()
  public idCredor: string

  @column()
  public idDevedor: string

  @column()
  public valorInicial: number

  @column()
  public valorFinal: number

  @column.dateTime({ autoCreate: true })
  public data: DateTime

  @column()
  public status_remessa: boolean

  @column()
  public motivo: string
}
