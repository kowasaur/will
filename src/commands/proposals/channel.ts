import { EmbedFieldData } from "discord.js";
import { SubCommand, Validator } from "its-not-commando";
import { Client, CommandMessage } from 'its-not-commando';
import { lastArrayElement } from "../../utility";
import { Proposal } from '../proposal';

export class Channel extends SubCommand{
  constructor() {
    super({
      name: 'channel',
      description: 'Manage a channel',
      subcommands: [Create]
    });
  };
}

export class Create extends Proposal {
  constructor() {
    super({
      name: 'create',
      description: 'Create a new channel',
      importance: 'medium',
      arguments: [
        { name: 'name' },
        { 
          name: 'type',
          validator: Validator.OneOf(["text", "voice", "category"]),
          optional: true,
          defaultValue: "text"
        },
        {
          name: 'category',
          optional: true,
          defaultValue: ""
        }
        // TODO: Everything else a channel create can do
      ]
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    const guild = msg.guild!;

    const type = args[1] as "text" | "voice" | "category"

    const category = guild.channels.cache.find(cat => cat.name.toLowerCase() === args[2].toLowerCase())
    
    let otherFields: EmbedFieldData[] = [{name: "type", value: type}];

    if (category) {
      otherFields.push({ name: "Category", value: category.name})
    }
    
    this.createProposal(msg, args, client, `Create Channel "${args[0]}"`, async () => {
      try {
        await guild.channels.create(args[0], { 
          type: type,
          parent: category,
          reason: lastArrayElement(args)
        })
        return 'success';
      } catch {
        return '```fix\nAn error occurred. Execution unsuccessful```';
      }
    }, otherFields);
  }
}
