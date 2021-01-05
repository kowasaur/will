import { MessageEmbed } from "discord.js";
import { purple } from "discordjs-colors";
import { Command, CommandMessage } from "its-not-commando";

export class Info extends Command {
  constructor() {
    super({
      name: "info",
      description: "See information about this bot",
      aliases: ["information"]
    })
  }

  async run(msg: CommandMessage) {
    const embed = new MessageEmbed()
      .setColor(purple)
      .setTitle("Info")
      .setDescription(`This bot carries out the will of the people. The primary feature is the \
        ;propose command which sends a proposal to make a change to the server; for example, \
        adding an emoji. Proposals are of different importance depending on how significant the \
        thing that is being proposed is. A higher importance means it will take longer to finalise. \
        You can tell the importance of a proposal by the colour: red is high, orange is medium and \
        yellow is low. If you want to report an error or suggestion, use the ;report command.
        
        [Github](https://github.com/kowasaur/will)`);
    
    msg.say(embed);
  }
}