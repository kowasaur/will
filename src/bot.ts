require("dotenv").config();

import { DiscordAPIError } from "discord.js";
import { Client } from "its-not-commando";
import { Poll } from "./commands/poll";
import { Propose } from "./commands/propose";
import { Setup } from "./commands/setup";
import { Hyphenate } from "./commands/hyphenate"
import { Report } from "./commands/report";

const client = new Client({
  owner: process.env.DISCORDJS_BOT_OWNER!,
  prefix: ";",
  token: process.env.DISCORDJS_BOT_TOKEN!
});

client.registry.registerCommands([Setup, Propose, Poll, Hyphenate, Report])

client.start()

// Send myself errors
process.on("unhandledRejection", (e: DiscordAPIError) => 
  client.users.cache.get(client.owner)?.send(
    e.name + ": ```CSS\n[" + e.message + "]\n" + e.path + "\n." + e.code + "```"
  )
);
