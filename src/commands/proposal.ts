import { SubCommand, SubCommandOptions, CommandMessage, Client } from "its-not-commando"
import { MessageEmbed, TextChannel, GuildMember, EmbedFieldData } from "discord.js";
import colors from "discordjs-colors";
import { knex } from "../database"
import { lastArrayElement, timeMinutesLater } from "../utility";

type importance = 'low' | 'medium' | 'high' | 'variable'

type ProposalOptions = SubCommandOptions & {
  importance: importance
};

type importanceValues = {
  [key in importance]: {
    seconds: number | undefined;
    color: any;
  };
};

const importanceValues: importanceValues = {
  low: {
    seconds: 3,
    color: colors.gold
  },
  medium: {
    seconds: 5,
    color: colors.orange
  },
  high: {
    seconds: 10,
    color: colors.red
  },
  variable: {
    seconds: undefined,
    color: undefined
  }
}

export abstract class Proposal extends SubCommand {
  constructor(private options: ProposalOptions) {
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

  public notMember(msg: CommandMessage, member: GuildMember | null) {
    if (!member) {
      msg.reply("that user could not be found");
      return true;
    } else return false;
  }

  public async createProposal (msg: CommandMessage, args: string[], client: Client, embedTitle: string, successFunction: () => Promise<"success" | string>, otherFields?: EmbedFieldData[], imp?: importance, thumbnail?: string) {
    const guild = msg.guild!
    const reason = lastArrayElement(args)

    let importance = this.options.importance
    if (importance === 'variable' && imp) {
      importance = imp
    }
    const time = importanceValues[importance].seconds
    const color = importanceValues[importance].color

    const proposalsId: string = (await knex('settings')
      .where('id', guild.id)
      .pluck('proposalsChannel'))[0]
    const pChannel = client.channels.cache.get(proposalsId) as TextChannel

    const embed = new MessageEmbed()
      .setColor(color) 
      .setTitle(embedTitle)
      .setAuthor(`${msg.author.username}'s Proposal`, msg.author.avatarURL() || undefined)
      .setDescription(reason ?? "")
      // .addField("Reason", "React with ✅ to approve. React with ❎ to disapprove.")
      .setFooter("Ends")
      .setTimestamp(timeMinutesLater((time ?? 0) / 60))
    if (otherFields) {
      embed.addFields(otherFields)
    }
    if (thumbnail) {
      embed.setThumbnail(thumbnail);
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
      message.reactions.removeAll()
    }, time! * 1000)
  }

}