import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Pagamentos extends BaseSchema {
  protected tableName = 'pagamentos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idRemessa').primary()
      table.float('valor_inicial').notNullable()
      table.float('valor_final').notNullable()
      table.boolean('status_remessa').notNullable().defaultTo(0)
      table.string('motivo')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
