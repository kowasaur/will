import { Client, CommandMessage, Validator } from 'its-not-commando';
import { Proposal } from '../proposal';

export class Ban extends Proposal {
  constructor() {
    super({
      name: 'ban',
      description: 'Ban a user from the server (delete max 7 days messages)',
      arguments: [
        {
          name: 'user',
          validator: Validator.User
        },
        {
          name: 'delete message days',
          validator: Validator.IntegerRange(0, 7),
          optional: true
        }
      ]
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    const member = msg.guild!.member(args[0]);
    if (this.notMember(msg, member)) return;
    
    this.createProposal(msg, args, client, `Ban ${member!.displayName}`, async () => {
      try {
        await member!.ban({
          days: Number(args[1]),
          reason: this.lastArrayElement(args) ?? "Successful Proposal"
        })  
        return 'success';
      } catch {
        return '```fix\nI am missing the permission(s) neccessary to execute the proposal```';
      }
    });
  }
}
