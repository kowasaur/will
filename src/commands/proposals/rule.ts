import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { blurple } from 'discordjs-colors';
import { Client, CommandMessage, SubCommand, Validator } from 'its-not-commando';
import { knex } from '../../database';
import { hyphenToSpace } from '../../utility';
import { Proposal } from '../proposal';

export class Rule extends SubCommand{
  constructor() {
    super({
      name: 'rule',
      description: 'Modify a rule',
      subcommands: [RuleAdd, RuleRemove]
    });
  };
}

type cb = (rules: string[] | undefined) => string[]

async function ruleThingo(msg: CommandMessage, args: string[], client: Client, cb: cb) {
  const guild = msg.guild!;

  const data = await knex('settings')
    .select('rulesChannel', 'lastRule')
    .where('id', guild.id)
    .first()
  const rulesId = data.rulesChannel
  const rChannel = client.channels.cache.get(rulesId) as TextChannel
  
  let oldMessage: Message | undefined;
  try {
    oldMessage = (data.lastRule) ? 
      await rChannel.messages.fetch(data.lastRule) : undefined;
  } catch {
    oldMessage = undefined;
  }

  const oldRules = oldMessage?.embeds[0] 
  const rules = oldRules?.description?.split("\n").map(r => r.split("** ")[1])
  
  const newRules = cb(rules)
  const description = [""].concat(newRules).reduce((pre, curr, i) => `${pre}**${i}.** ${curr}\n`)

  const embed = new MessageEmbed(oldRules)
    .setTitle("Rules")
    .setDescription(description)
    .setColor(blurple)

  if (oldRules) {
    await oldMessage?.delete()
  }

  const newMessage = await rChannel.send(embed)
  await knex('settings').where('id', guild.id).update('lastRule', newMessage.id)

}

class RuleAdd extends Proposal {
  constructor() {
    super({
      name: 'add',
      description: 'Add a rule (use hyphens (-) instead of a spaces for the rule)',
      arguments: [{
        name: 'rule',
      }],
      importance: 'medium'
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    const rule = hyphenToSpace(args[0])

    this.createProposal(msg, args, client, `Add Rule "${rule}"`, async () => {
      try {
        await ruleThingo(msg, args, client, rules => {
          rules?.push(rule);
          return rules ?? [rule];
        })
        return 'success';
      } catch {
        return '```fix\nAn error occurred. Execution unsuccessful```';
      }
    });
  }
}

class RuleRemove extends Proposal {
  constructor() {
    super({
      name: 'remove',
      description: 'Remove a rule',
      importance: 'high',
      arguments: [{
        name: 'rule number',
        validator: Validator.IntegerRange(1, 69)
      }]
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    const ruleIndex = Number(args[0])

    this.createProposal(msg, args, client, `Remove rule ${ruleIndex}`, async () => {
      try {
        await ruleThingo(msg, args, client, rules => {
          rules?.splice(ruleIndex - 1, 1)
          return rules ?? []
        })
        return 'success';
      } catch {
        return '```fix\nAn error occurred. Execution unsuccessful```';
      }
    });
  }
}
