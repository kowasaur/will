import { SubCommand } from "its-not-commando";
import { Client, CommandMessage } from 'its-not-commando';
import { lastArrayElement } from "../../utility";
import { Proposal } from '../proposal';

export class Emoji extends SubCommand{
  constructor() {
    super({
      name: 'emoji',
      description: 'Modify emojis',
      subcommands: [Create]
    });
  };
}

export class Create extends Proposal {
  constructor() {
    super({
      name: 'create',
      description: 'Create a new emoji',
      importance: 'low',
      arguments: [{
        name: 'name',
      }]
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    const image = msg.attachments.first()
    if (!image) {
      msg.reply('you must attach an image');
      return;
    }
    if (image.size > 256000) {
      msg.reply('that image is too big [more than 256kb]')
      return;
    }
    
    const guild = msg.guild!
    
    this.createProposal(msg, args, client, `Create new emoji :${args[0]}:`, async () => {
      try {
        await guild.emojis.create(image.proxyURL, args[0], { reason: lastArrayElement(args) })
        return 'success';
      } catch {
        return '```fix\nAn error occurred. Execution unsuccessful```';
      }
    }, undefined, undefined, image.proxyURL);
  }
}
