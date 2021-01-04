require("dotenv").config();

import { Client } from "its-not-commando";
import { Poll } from "./commands/poll";
import { Propose } from "./commands/propose";
import { Setup } from "./commands/setup";

const client = new Client({
  owner: process.env.DISCORDJS_BOT_OWNER!,
  prefix: ";",
  token: process.env.DISCORDJS_BOT_TOKEN!
});

client.registry.registerCommands([Setup, Propose, Poll])

client.start()
