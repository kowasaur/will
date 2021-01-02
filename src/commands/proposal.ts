import { SubCommand, SubCommandOptions, CommandMessage, Client } from "its-not-commando"
import { MessageEmbed, TextChannel, GuildMember, EmbedFieldData } from "discord.js";
import colors from "discordjs-colors";
import { knex } from "../database"

export abstract class Proposal extends SubCommand {
  constructor(options: SubCommandOptions) {
    super({
      name: options.name,
      description: options.description,
      arguments: [...(options.arguments ?? []), {
        name: "reason",
        multi: true,
        optional: true
      }]
    })
  }

  public lastArrayElement(array: any[]) {
    return array[array.length - 1]
  }

  public hyphenToSpace(str: string) {
    return str.replace(/-/g, " ");
  }

  public notMember(msg: CommandMessage, member: GuildMember | null) {
    if (!member) {
      msg.reply("that user could not be found");
      return true;
    } else return false;
  }

  public async createProposal (msg: CommandMessage, args: string[], client: Client, embedTitle: string, successFunction: () => Promise<"success" | string>, otherFields?: EmbedFieldData[]) {
    const guild = msg.guild!
    const reason = this.lastArrayElement(args)

    const proposalsId: string = (await knex('settings')
      .where('id', guild.id)
      .pluck('proposalsChannel'))[0]
    const pChannel = client.channels.cache.get(proposalsId) as TextChannel

    const embed = new MessageEmbed()
      .setColor(colors.randomColor()) 
      .setTitle(embedTitle)
      .setAuthor(`${msg.author.username}'s Proposal`, msg.author.avatarURL() || undefined)
      .setDescription(reason ?? "")
      // .addField("Reason", "React with ✅ to approve. React with ❎ to disapprove.")
      .setFooter("Ends")
      // I need to make this say when it ends
      // .setTimestamp()
    if (otherFields) {
      embed.addFields(otherFields)
    }
      
    const message = await pChannel.send(embed);
    message.react('✅')
    message.react('❎')

    setTimeout(async () => {
      const cache = message.reactions.cache
      const approveCount = (cache.get("✅")?.count ?? 0) - 1
      const disapproveCount = (cache.get("❎")?.count ?? 0) - 1
      
      embed.setFooter("Ended")
        .addField("Results", `✅ ${approveCount}　 ❎ ${disapproveCount}`)
        .setTimestamp()

      if (approveCount > disapproveCount) {
        const errorMessage = await successFunction()
        if (errorMessage !== "success") {
          pChannel.send(errorMessage);
        }
        embed.setColor(colors.green)
          .addField("Success", "This proposal passed successfully")
      } else {
        embed.setColor(colors.notquiteblack)
          .addField("Fail", "This proposal failed to pass")
      }
      message.edit(embed)
    }, 3 * 1000)
  }

}