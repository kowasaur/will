import { Command, CommandMessage, SubCommand, Validator } from "its-not-commando";
import { knex } from "../database";

export class Setup extends Command {
  constructor() {
    super({
      name: "setup",
      description: "**[Admin Only]** Setup/change bot settings",
      subcommands: [ProposalsChannel, RulesChannel]
    });
  }
}

function save(msg: CommandMessage, args: string[], column: string) {
  if (!msg.guild) {
    msg.reply("You can't use this command in DMs");
    return;
  } else if (!msg.member?.hasPermission('ADMINISTRATOR')) {
    msg.reply("You must be an administrator to use this command");
    return;
  }

  const newValue = args[0];
  const guild = msg.guild.id;

  knex('settings').insert({
    id: guild,
    [column]: newValue
  }).onConflict('id').merge().then(() => {
    msg.reply("setting updated");
  });
}

class ProposalsChannel extends SubCommand {
  constructor() {
    super({
      name: "proposals",
      description: "Change the channel where proposals are sent in",
      arguments: [{ 
        name: "channel",
        validator: Validator.Channel
      }],
    });
  }

  async run(msg: CommandMessage, args: string[]) {
    save(msg, args, 'proposalsChannel');
  }
}

class RulesChannel extends SubCommand {
  constructor() {
    super({
      name: "rules",
      description: "Change the channel where the rules are posted",
      arguments: [{ 
        name: "channel",
        validator: Validator.Channel
      }],
    })
  }

  async run(msg: CommandMessage, args: string[]) {
    save(msg, args, 'rulesChannel');
  }
}