import { EmbedFieldData, Permissions, PermissionString } from "discord.js";
import { Client, CommandMessage, SubCommand, Validator } from "its-not-commando";
import { CustomValidator } from "../../customValidator";
import { Proposal } from '../proposal';

export class RoleCommand extends SubCommand{
  constructor() {
    super({
      name: 'role',
      description: 'Modify a role',
      subcommands: [RoleCreate]
    });
  };
}

const flags = Object.keys(Permissions.FLAGS)

export class RoleCreate extends Proposal {
  constructor() {
    super({
      name: 'create',
      description: 'Create a new role',
      arguments: [
        { name: 'name' },
        { 
          name: 'colour', 
          validator: CustomValidator.Color,
          optional: true
        },
        {
          name: 'position',
          validator: Validator.Integer,
          optional: true
        },
        {
          name: 'mentionable',
          validator: CustomValidator.BetterBoolean,
          optional: true
        }
      ]
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    const input = await msg.prompt("What permissions do you want the role to have? (refer to here: https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS; say none for none)")
    const permissions = input?.replace(/\s/g,'').toUpperCase().split(",")

    const acceptablePerms = permissions?.filter(perm => {
      return flags.includes(perm);
    })
    
    const guild = msg.guild!;
    const name = this.hyphenToSpace(args[0])
    
    let otherFields: EmbedFieldData[] = [];
    if (acceptablePerms?.length) {
      otherFields.push({
        name: "Permissions",
        value: acceptablePerms.toString()
      })
    }
    if (args[1]) {
      otherFields.push({
        name: "Colour",
        value: args[1]
      })
    }
    if (args[2]) {
      otherFields.push({
        name: "Position",
        value: args[2]
      })
    }
    if (args[3]) {
      otherFields.push({
        name: "Mentionable",
        value: args[3]
      })
    }

    this.createProposal(msg, args, client, `Create Role "${name}"`, async () => {
      try {
        guild.roles.create({
          data: {
            name: name,
            color: args[1],
            position: Number(args[2]),
            mentionable: (args[3] == "true"),
            permissions: acceptablePerms as unknown as PermissionString
          },
          reason: this.lastArrayElement(args)
        })
        return 'success';
      } catch {
        return '```fix\nAn error occurred. Execution unsuccessful```';
      }
    }, otherFields);
  }
}
