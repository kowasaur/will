require("dotenv").config();

import { Client } from "its-not-commando";

const client = new Client({
  owner: process.env.DISCORDJS_BOT_OWNER!,
  prefix: ";",
  token: process.env.DISCORDJS_BOT_TOKEN!
});

client.start()
