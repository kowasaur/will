import colors from "discordjs-colors"

// I think the colors thing is messed up
// So this is a band aid solution
const Colors = colors as {
  [key: string]: any
}

const yes = ["true", "t", "yes", "y"]
const no = ["false", "f", "no", "n"]

export const CustomValidator = {
  Color: (arg: string) => {
    if (Object.keys(Colors).includes(arg.toLowerCase())) {
      return Colors[arg.toLowerCase()]
      // test if hexadecimal
    } else if (/^#[0-9A-F]{6}$/i.test(arg)) {
      return arg
    } else {
      return null
    }
  },
  BetterBoolean: (arg: string) => {
    const bool = arg.toLowerCase()
    if (yes.includes(bool)) {
      return "true";
    } else if (no.includes(bool)) {
      return "false";
    } else {
      return null;
    }
  }
}