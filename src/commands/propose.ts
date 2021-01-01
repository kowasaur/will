import { Command } from "its-not-commando";
import { Kick } from "./proposals/kick";

export class Propose extends Command{
  constructor() {
    super({
      name: "propose",
      description: "Propose a change to the server",
      subcommands: [Kick],
      dmAllowed: false
    })
  }
}
