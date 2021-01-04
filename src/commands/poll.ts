import { Client, MessageEmbed, TextChannel } from "discord.js";
import { blue } from "discordjs-colors";
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
      .setColor(blue)
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
      
      const most = options[counts.indexOf(Math.max(...counts))]
      const least = options[counts.indexOf(Math.min(...counts))]

      embed.addFields(
        { name: "Results", value: result},
        { name: "Most Popular", value: most},
        { name: "Lease Popular", value: least},
      ).setFooter("Ended").setTimestamp()
      message.edit(embed)
    }, minutes * 60 * 1000);
  }
}