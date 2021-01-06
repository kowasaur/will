import './reset'
const input = require('prompt-sync')()
import { writeFile } from "fs";
import { join } from "path";

const token = input("Bot token: ")
const id = input("Owner ID: ")

const env = `DISCORDJS_BOT_TOKEN=${token}
DISCORDJS_BOT_OWNER=${id}`

writeFile(join(__dirname, '..', '.env'), env, e => {
  if(e) throw e;
  console.log(`.env written successfully`);
})