import path from "path";
import Knex from "knex";

// Database
export const knex = Knex({
  client: "sqlite3",
  connection: { filename: path.join(__dirname, ".." ,"database.sqlite") },
  useNullAsDefault: true
});
