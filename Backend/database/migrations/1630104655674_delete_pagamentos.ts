import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DeletePagamentos extends BaseSchema {
  protected tableName = 'pagamentos'

  public async up () {
    this.schema.dropTable(this.tableName)
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
