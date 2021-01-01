import { Client, Command, CommandMessage, SubCommand, Validator } from "its-not-commando";
import { MessageEmbed, TextChannel } from "discord.js";
import colors from "discordjs-colors";
import { knex } from "../database";

export class Propose extends Command{
  constructor() {
    super({
      name: "propose",
      description: "Propose a change to the server",
      subcommands: [Kick]
    })
  }
}

class Kick extends SubCommand{
  constructor() {
    super({
      name: "kick",
      description: "Kick a user from the server",
      arguments: [
      {
        name: "user",
        validator: Validator.User
      },
      {
        name: "reason",
        multi: true,
        optional: true
      }
    ]
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    if (!msg.guild) {
      msg.reply("You can't make proposals in DMs");
      return;
    }

    const guild = msg.guild
    const member = guild.member(args[0])

    if (!member) {
      msg.reply("That user could not be found");
      return;
    }
    
    const proposalsId: string = (await knex('settings')
      .where('id', guild.id)
      .pluck('proposalsChannel'))[0]
    const pChannel = await client.channels.cache.get(proposalsId) as TextChannel

    const embed = new MessageEmbed()
      .setColor(colors.randomColor()) 
      .setTitle(`Kick ${member.displayName}`)
      .setAuthor(`${msg.author.username}'s Proposal`, msg.author.avatarURL() || undefined)
      .setDescription(args[1] ?? "")
      // .addField("Reason", "React with ✅ to approve. React with ❎ to disapprove.")
      .setFooter("Ends")
      .setTimestamp()

    const message = await pChannel.send(embed);
    message.react('✅')
    message.react('❎')

    setTimeout(() => {
      const cache = message.reactions.cache
      const approveCount = (cache.get("✅")?.count ?? 0) - 1
      const disapproveCount = (cache.get("❎")?.count ?? 0) - 1
      
      embed.setFooter("Ended")
        .addField("Results", `✅ ${approveCount}　 ❎ ${disapproveCount}`)
        .setTimestamp()

      if (approveCount > disapproveCount) {
        member.kick(args[1] ?? "Successful Proposal").catch(e => {
          pChannel.send("```fix\nI am missing the permission(s) neccessary to execute the proposal```")
        })
        embed.setColor(colors.green)
          .addField("Success", "This proposal passed successfully")
      } else {
        embed.setColor(colors.notquiteblack)
          .addField("Fail", "This proposal failed to pass")
      }
      message.edit(embed)
    }, 3 * 1000);

  }
}