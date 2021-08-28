import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Pagamentos extends BaseSchema {
  protected tableName = 'pagamentos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_remessa').primary()
      table.integer('id_credor').notNullable().unsigned()
      table.integer('id_devedor').notNullable().unsigned()
      table.float('valor_inicial').notNullable().unsigned()
      table.float('valor_final').notNullable().unsigned()
      table.timestamp('data')
      table.boolean('status_remessa').defaultTo(false)
      table.string('motivo')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
