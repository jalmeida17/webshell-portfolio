import { t } from '../translations';

export const createHelp = () : string[] => {
  const help : string[] = []
  help.push("<br>")

  t().help.commands.forEach((ele) => {
    const SPACE = "&nbsp;";
    let string = "";
    string += SPACE.repeat(2);
    string += "<span class='command'>";
    string += ele[0];
    string += "</span>";
    string += SPACE.repeat(17 - ele[0].length);
    string += ele[1];
    help.push(string);
  })

  help.push("<br>");

  return help
}

export const HELP = createHelp();
