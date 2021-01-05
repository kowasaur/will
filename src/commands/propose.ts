import { Command } from "its-not-commando";
import { Ban } from "./proposals/ban";
import { Channel } from "./proposals/channel";
import { Emoji } from "./proposals/emoji";
import { Kick } from "./proposals/kick";
import { RoleCommand } from "./proposals/role";
import { Rule } from "./proposals/rule";

export class Propose extends Command{
  constructor() {
    super({
      name: "propose",
      description: "Propose a change to the server",
      subcommands: [Kick, Ban, Rule, RoleCommand, Emoji, Channel],
      dmAllowed: false,
      examples: [['propose rule add No-spam-except-in-#spam No one wants to be annoyed', 
      'Creates a proposal to add the rule "No spam except in #spam" with the reason "No one wants to be annoyed"']],
    })
  }
}
