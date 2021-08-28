import { DateTime } from 'luxon'
import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm'
import Encryption from '@ioc:Adonis/Core/Encryption'
export default class Credor extends BaseModel {
  @column({ isPrimary: true })
  public idCredor: number

  @column()
  public nomeCredor: string

  @column({prepare: (value: string) => Encryption.encrypt(value),
            consume: (value: string) => Encryption.decrypt(value)})
  public cpfCredor: string

  @column()
  public statusCredor: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
