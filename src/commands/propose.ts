import { Command } from "its-not-commando";
import { Ban } from "./proposals/ban";
import { Emoji } from "./proposals/emoji";
import { Kick } from "./proposals/kick";
import { RoleCommand } from "./proposals/role";
import { Rule } from "./proposals/rule";

export class Propose extends Command{
  constructor() {
    super({
      name: "propose",
      description: "Propose a change to the server",
      subcommands: [Kick, Ban, Rule, RoleCommand, Emoji],
      dmAllowed: false,
      examples: [['propose rule add No-NSFW-except-in-#NSFW i don\'t wanna see that', 'Creates a proposal to add the rule "No NSFW except in #NSFW" with the reason "i dont\'t wanna see that"']],
    })
  }
}
