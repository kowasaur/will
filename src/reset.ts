import { CreateTableBuilder } from "knex";
import { knex } from "./database.js";

knex.schema.dropTableIfExists('settings').then(() => {
  knex.schema.createTable('settings', (table:CreateTableBuilder) => {
    table.text('id').primary();
    table.text('prefix').defaultTo(';');
    table.text('proposalsChannel');
    table.text('rulesChannel');
    table.text('lastRule')
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
