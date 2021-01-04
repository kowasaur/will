import { Client, CommandMessage, Validator } from "its-not-commando";
import { lastArrayElement } from "../../utility";
import { Proposal } from "../proposal";

export class Kick extends Proposal {
  constructor() {
    super({
      name: "kick",
      description: "Kick a user from the server",
      importance: 'medium',
      arguments: [{
        name: "user",
        validator: Validator.User
      }]
    })
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    const member = msg.guild!.member(args[0]);
    if (this.notMember(msg, member)) return;

    this.createProposal(msg, args, client, `Kick ${member!.displayName}`, async () => {
      try {
        await member!.kick(lastArrayElement(args) ?? "Successful Proposal");
        return "success";
      } catch {
        return "```fix\nI am missing the permission(s) neccessary to execute the proposal```";
      }
    });
  }
}
