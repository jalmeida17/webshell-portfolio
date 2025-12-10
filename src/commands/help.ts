export const createHelp = () : string[] => {
  const help : string[] = []
  const SPACE = "&nbsp;";
  help.push("<br>")

  const commands = [
    ["'about'", "Who made this website?"],
    ["'projects'", "Maybe there's something interesting."],
    ["'career'", "Professional experience."],
    ["'education'", "Education background."],
    ["'skills'", "Technical & soft skills."],
    ["'news'", "Today's tech & science headlines."],
    ["'cv'", "Download my CV."],
    ["'banner'", "Display the banner."],
    ["'clear'", "Clear the terminal."],
    ["'sudo'", "???"],
  ];

  commands.forEach((ele) => {
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
