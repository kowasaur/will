import { Command } from "its-not-commando";
import { Ban } from "./proposals/ban";
import { Kick } from "./proposals/kick";

export class Propose extends Command{
  constructor() {
    super({
      name: "propose",
      description: "Propose a change to the server",
      subcommands: [Kick, Ban],
      dmAllowed: false
    })
  }
}
