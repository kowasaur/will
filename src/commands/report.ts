import { Client, Command, CommandMessage } from "its-not-commando";

export class Report extends Command {
  constructor() {
    super({
      name: "report",
      description: "Report an error or suggestion",
      arguments: [{
        name: "error/suggestion",
        multi: true
      }],
      rateLimit: { max: 1, seconds: 3000 }
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    try {
      await client.users.cache.get(client.owner)?.send(
        msg.author.toString() + " reported an error in `" + msg.guild?.toString() + "`: ```" + args[0] + "```"
      );
      msg.reply("report sent successfully")
    } catch (e) {
      msg.reply("an error occurred: ```" + e + "```")
    }
  }
}