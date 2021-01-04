import { Client, MessageEmbed, TextChannel } from "discord.js";
import { aqua, blue } from "discordjs-colors";
import { Command, CommandMessage, Validator } from "its-not-commando";
import { knex } from "../database";
import { hyphenToSpace, timeMinutesLater } from "../utility";

const emojiNumbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

export class Poll extends Command{
  constructor() {
    super({
      name: "poll",
      description: "Create a poll",
      dmAllowed: false,
      details: "This can be used to simply see what people want. Nothing is done by the bot from the result.\nThe default minutes is 60 and the default options are yes and no",
      arguments: [
        { name: "question" },
        { 
          name: "minutes",
          validator: Validator.Float,
          optional: true,
          defaultValue: "60"
        },
        {
          name: "option1",
          optional: true,
          defaultValue: "yes"
        },
        {
          name: "option2",
          optional: true,
          defaultValue: "no"
        },
        {
          name: "option3",
          optional: true
        },
        {
          name: "option4",
          optional: true
        },
        {
          name: "option5",
          optional: true
        },
      ]
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    const guild = msg.guild!
    const question = hyphenToSpace(args[0])
    const minutes = Number(args[1])

    const options = args.slice(2).filter(Boolean).map(o => hyphenToSpace(o))
    let description = "";
    options.forEach((value, index) => description += emojiNumbers[index] + ": " + value + "\n");

    const pollsId: string = (await knex('settings')
      .where('id', guild.id)
      .pluck('pollsChannel'))[0]
    const pChannel = client.channels.cache.get(pollsId) as TextChannel

    const embed = new MessageEmbed()
      .setColor(aqua)
      .setTitle(question)
      .setAuthor(`${msg.author.username}'s Poll`, msg.author.avatarURL() || undefined)
      .setFooter("Ends")
      .setDescription(description)
      .setTimestamp(timeMinutesLater(minutes))

    const emojis = options.map((_, index) => emojiNumbers[index]);

    const message = await pChannel.send(embed)
    emojis.forEach(emoji => message.react(emoji))

    setTimeout(async () => {
      const cache = message.reactions.cache;
      const counts = emojis.map(emoji => (cache.get(emoji)?.count ?? 0) - 1)
      const result = emojis.map((e, index) => `${e}: ${counts[index]}`).join("\n")

      embed.addField("Results", result)
        .setFooter("Ended")
        .setTimestamp()
        .setColor(blue)

      if (counts.length > 2) {
        // https://stackoverflow.com/a/41271541/13837629
        function countsOptionsValues(value:number) {
          const x =  counts.map((val, index) => val === value ? index : "")
            .filter(String) as number[]
          return x.map(i => options[i]).join(", ")
        }

        const max = Math.max(...counts)
        const min = Math.min(...counts)

        const most = countsOptionsValues(max)
        const least = countsOptionsValues(min)

        embed.addFields(
          { name: "Most Popular", value: most},
          { name: "Least Popular", value: least},
        )
      } 
      
      message.edit(embed)
      message.reactions.removeAll()
    }, minutes * 60 * 1000);
  }
}