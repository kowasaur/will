import { SubCommand, SubCommandOptions, CommandMessage, Client } from "its-not-commando"
import { MessageEmbed, TextChannel } from "discord.js";
import colors from "discordjs-colors";
import { knex } from "../database"

export abstract class Proposal extends SubCommand {
  constructor(private options: SubCommandOptions) {
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

  public async createProposal (msg: CommandMessage, args: string[], client: Client, embedTitle: string, successFunction: () => Promise<"success" | string>) {
    const guild = msg.guild!
    const reason = this.lastArrayElement(args)

    const proposalsId: string = (await knex('settings')
      .where('id', guild.id)
      .pluck('proposalsChannel'))[0]
    const pChannel = await client.channels.cache.get(proposalsId) as TextChannel

    const embed = new MessageEmbed()
      .setColor(colors.randomColor()) 
      .setTitle(embedTitle)
      .setAuthor(`${msg.author.username}'s Proposal`, msg.author.avatarURL() || undefined)
      .setDescription(reason ?? "")
      // .addField("Reason", "React with ✅ to approve. React with ❎ to disapprove.")
      .setFooter("Ends")
      // I need to make this say when it ends
      // .setTimestamp()

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
        // member.kick(reason ?? "Successful Proposal").catch(e => {
        //   pChannel.send("```fix\nI am missing the permission(s) neccessary to execute the proposal```")
        // })
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