import { Command, CommandMessage } from "its-not-commando";

export class Hyphenate extends Command {
  constructor() {
    super({
      name: "hyphenate",
      aliases: ["h", "hyphen"],
      description: "Turn a normal phrase into a hyphenated one to be used for this bot",
      arguments: [{
        name: "phrase",
        multi: true
      }]
    })
  }

  async run(msg: CommandMessage, args: string[]) {
    msg.say(args[0].replace(/\s/g, "-"));
  }
}