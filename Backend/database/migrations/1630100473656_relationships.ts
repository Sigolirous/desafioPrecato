import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Relationships extends BaseSchema {
  protected tableName = 'pagamentos'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('id_credor').unsigned().references('id_credor').inTable('credors')
      table.integer('id_ente_devedor').unsigned().references('id_devedor').inTable('ente_devedors')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
