import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { blurple } from 'discordjs-colors';
import { Client, CommandMessage } from 'its-not-commando';
import { SubCommand } from "its-not-commando";
import { knex } from '../../database';
import { hyphenToSpace } from '../../utility';
import { Proposal } from '../proposal';

export class Rule extends SubCommand{
  constructor() {
    super({
      name: 'rule',
      description: 'Modify a rule',
      subcommands: [RuleAdd]
    });
  };
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
    const guild = msg.guild!;
    const rule = hyphenToSpace(args[0])

    this.createProposal(msg, args, client, `Add Rule "${rule}"`, async () => {
      try {
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
        const rules = oldRules?.description?.split("\n")        
        const latestNumber = (rules) ? rules.length + 1 : 1;
            
        const embed = new MessageEmbed(oldRules)
          .setTitle("Rules")
          .setDescription(`${oldRules?.description ?? ""}\n**${latestNumber}.** ${rule}`)
          .setColor(blurple)

        if (oldRules) {
          await oldMessage?.delete()
        }

        const newMessage = await rChannel.send(embed)
        await knex('settings').where('id', guild.id).update('lastRule', newMessage.id)

        return 'success';
      } catch {
        return '```fix\nAn error occurred. Execution unsuccessful```';
      }
    });
  }
}
