import { EmbedFieldData, Permissions, PermissionString } from "discord.js";
import { Client, CommandMessage, SubCommand, Validator } from "its-not-commando";
import { CustomValidator } from "../../customValidator";
import { hyphenToSpace, lastArrayElement } from "../../utility";
import { Proposal } from '../proposal';

export class RoleCommand extends SubCommand{
  constructor() {
    super({
      name: 'role',
      description: 'Modify a role',
      subcommands: [RoleCreate, RoleGive, RoleDelete, RoleRemove]
    });
  };
}

const flags = Object.keys(Permissions.FLAGS)

class RoleCreate extends Proposal {
  constructor() {
    super({
      name: 'create',
      description: 'Create a new role',
      importance: 'low',
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
        },
        // this means display separately
        {
          name: 'hoist',
          validator: CustomValidator.BetterBoolean,
          optional: true
        }
      ]
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    const input = await msg.prompt("What permissions do you want the role to have? (comma separated; refer to here: https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS; say none for none)")
    const permissions = input?.replace(/\s/g,'').toUpperCase().split(",")

    const acceptablePerms = permissions?.filter(perm => {
      return flags.includes(perm);
    })
    
    const guild = msg.guild!;
    const name = hyphenToSpace(args[0])
    
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
    if (args[4]) {
      otherFields.push({
        name: "Hoist",
        value: args[4]
      })
    }

    this.createProposal(msg, args, client, `Create Role "${name}"`, async () => {
      try {
        await guild.roles.create({
          data: {
            name: name,
            color: args[1],
            position: Number(args[2]),
            mentionable: (args[3] == "true"),
            hoist: (args[4] == "true"),
            permissions: acceptablePerms as unknown as PermissionString
          },
          reason: lastArrayElement(args)
        })
        return 'success';
      } catch {
        return '```fix\nAn error occurred. Execution unsuccessful```';
      }
    }, otherFields);
  }
}


class RoleGive extends Proposal {
  constructor() {
    super({
      name: 'give',
      description: 'Give a role to someone',
      importance: 'variable',
      arguments: [
        {
          name: 'user',
          validator: Validator.User
        },
        {
          name: 'role',
          validator: Validator.Role
        }
      ]
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    const guild = msg.guild!;
    const role = guild.roles.cache.get(args[1])
    const user = guild.member(args[0]);

    if (!role) {
      msg.reply("Role not found");
      return;
    }

    const perms = role.permissions.toArray().toString();
    const field = perms ? [{ name: "Permissions", value: perms }] : undefined

    const importance = role.permissions.has('ADMINISTRATOR') ? 'high' : 'medium'

    this.createProposal(msg, args, client, `Give ${user?.displayName} the "${role.name}" role`, async () => {
      try {
        await user?.roles.add(role)
        return 'success';
      } catch {
        return '```fix\nAn error occurred. Execution unsuccessful```';
      }
    }, field, importance);
  }
}

class RoleDelete extends Proposal {
  constructor() {
    super({
      name: 'delete',
      description: 'Delete a role',
      importance: 'variable',
      arguments: [{
        name: 'role',
        validator: Validator.Role
      }]
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    const guild = msg.guild!;
    const role = guild.roles.cache.get(args[0])

    if (!role) {
      msg.reply("Role not found");
      return;
    }

    const importance = role.permissions.has('ADMINISTRATOR') ? 'high' : 'medium'

    this.createProposal(msg, args, client, `Delete the "${role.name}" role`, async () => {
      try {
        await role.delete(args[1])
        return 'success';
      } catch {
        return '```fix\nAn error occurred. Execution unsuccessful```';
      }
    }, undefined, importance);
  }
}

class RoleRemove extends Proposal {
  constructor() {
    super({
      name: 'remove',
      description: 'Remove a role from a user',
      importance: 'high',
      arguments: [
        {
          name: 'user',
          validator: Validator.User
        },
        {
          name: 'role',
          validator: Validator.Role
        }
      ]
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    const guild = msg.guild!;
    const role = guild.roles.cache.get(args[1])
    const user = guild.member(args[0]);

    if (!role) {
      msg.reply("Role not found");
      return;
    }

    this.createProposal(msg, args, client, `Remove the "${role.name}" role from ${user?.displayName}`, async () => {
      try {
        await user?.roles.remove(role)
        return 'success';
      } catch {
        return '```fix\nAn error occurred. Execution unsuccessful```';
      }
    });
  }
}
