import { CreateTableBuilder } from "knex";
import { knex } from "./database.js";

knex.schema.dropTableIfExists('settings').then(() => {
  knex.schema.createTable('settings', (table:CreateTableBuilder) => {
    table.integer('id').primary();
    table.text('prefix').defaultTo(';');
    table.integer('proposalsChannel');
    table.integer('rulesChannel');
  })
    .then(() => {
      console.log('success');
      knex.destroy()
    })
    .catch(err => {
      console.error(err);
      knex.destroy()
    })
})
