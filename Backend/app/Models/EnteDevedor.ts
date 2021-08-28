import { DateTime } from 'luxon'
import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm'
import Encryption from '@ioc:Adonis/Core/Encryption'

export default class EnteDevedor extends BaseModel {
  @column({ isPrimary: true })
  public idDevedor: number

  @column()
  public nomeEnteDevedor: string

  @column({prepare: (value: string) => Encryption.encrypt(value),
            consume: (value: string) => Encryption.decrypt(value)})
  public cnpjEnteDevedor: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
