import command from '../../config.json' assert {type: 'json'};

export const createAbout = () : string[] => {
  const about : string[] = [];

  const SPACE = "&nbsp;";

  const EMAIL = "Email";
  const GITHUB = "Github";
  const LINKEDIN = "Linkedin";
  const DISCORD = "Discord";
  const STEAM = "Steam";
  const PHONE = "Phone";
  
  const email = `<i class='fa-solid fa-envelope'></i> ${EMAIL}`;   
  const github = `<i class='fa-brands fa-github'></i> ${GITHUB}`;
  const linkedin = `<i class='fa-brands fa-linkedin'></i> ${LINKEDIN}`;
  const discord = `<i class='fa-brands fa-discord'></i> ${DISCORD}`;
  const steam = `<i class='fa-brands fa-steam'></i> ${STEAM}`;
  const phone = `<i class='fa-solid fa-phone'></i> ${PHONE}`;
  let string = "";

  about.push("<br>");
  about.push("Hi, I'm Joao ! I'm a Full Stack Developer passionate about coding and tech in general.");
  about.push("<br>");
  string += SPACE.repeat(2);
  string += email;
  string += SPACE.repeat(17 - EMAIL.length);
  string += `<a target='_blank' href='mailto:${command.social.email}'>${command.social.email}</a>`;
  about.push(string);

  string = '';
  string += SPACE.repeat(2);
  string += github;
  string += SPACE.repeat(17 - GITHUB.length);
  string += `<a target='_blank' href='https://github.com/${command.social.github}'>https://github.com/${command.social.github}</a>`;
  about.push(string);

  string = '';
  string += SPACE.repeat(2);
  string += linkedin;
  string += SPACE.repeat(17 - LINKEDIN.length);  
  string += `<a target='_blank' href='https://www.linkedin.com/in/${command.social.linkedin}'>https://www.linkedin.com/in/${command.social.linkedin}</a>`;
  about.push(string);
  
  string = '';
  string += SPACE.repeat(2);
  string += steam;
  string += SPACE.repeat(17 - STEAM.length);  
  string += `<a target='_blank' href='https://steamcommunity.com/profiles/${command.social.steam}'>https://steamcommunity.com/profiles/${command.social.steam}</a>`;
  about.push(string);

  string = '';
  string += SPACE.repeat(2);
  string += phone;
  string += SPACE.repeat(17 - PHONE.length);  
  string += `<a target='_blank' href='callto:${command.social.phone}'>${command.social.phone}</a>`;
  about.push(string);
  
  string = '';
  string += SPACE.repeat(2);
  string += discord;
  string += SPACE.repeat(17 - DISCORD.length);  
  string += `<span>${command.social.discord}</span>`;
  about.push(string);


  about.push("<br>");
  return about
}

export const ABOUT = createAbout();
