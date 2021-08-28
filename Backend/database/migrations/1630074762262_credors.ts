import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Credors extends BaseSchema {
  protected tableName = 'credors'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_credor').primary()
      table.string('nome_credor').notNullable()
      table.string('cpf_credor').notNullable().unique()
      table.boolean('status_credor').notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
