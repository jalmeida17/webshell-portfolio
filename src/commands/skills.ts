export const createSkills = () : string[] => {
  const skills : string[] = [];
  const SPACE = "&nbsp;";

  skills.push("<br>");
  
  // Programming Languages
  skills.push("<span class='command'><u>Programming Languages</u></span>");
  skills.push("<i class='fa-brands fa-js'></i> JavaScript" + SPACE.repeat(4) + "<i class='fa-brands fa-js'></i> TypeScript" + SPACE.repeat(4) + "<i class='fa-solid fa-hashtag'></i> C#");
  skills.push("<i class='fa-brands fa-python'></i> Python" + SPACE.repeat(4) + "<i class='fa-brands fa-html5'></i> HTML5" + SPACE.repeat(4) + "<i class='fa-brands fa-css3-alt'></i> CSS3");
  skills.push("<br>");
  
  // Frameworks & Libraries
  skills.push("<span class='command'><u>Frameworks & Libraries</u></span>");
  skills.push("<i class='fa-brands fa-react'></i> React.js" + SPACE.repeat(4) + "<i class='fa-brands fa-angular'></i> Angular" + SPACE.repeat(4) + "<i class='fa-brands fa-node-js'></i> Node.js");
  skills.push("<i class='fa-solid fa-code'></i> .NET / ASP.NET" + SPACE.repeat(4) + "<i class='fa-solid fa-layer-group'></i> PrimeNG");
  skills.push("<br>");
  
  // Databases
  skills.push("<span class='command'><u>Databases</u></span>");
  skills.push("<i class='fa-solid fa-database'></i> MariaDB" + SPACE.repeat(4) + "<i class='fa-solid fa-leaf'></i> MongoDB" + SPACE.repeat(4) + "<i class='fa-solid fa-database'></i> SQL");
  skills.push("<br>");
  
  // Cloud & DevOps
  skills.push("<span class='command'><u>Cloud & DevOps</u></span>");
  skills.push("<i class='fa-brands fa-git-alt'></i> Git" + SPACE.repeat(4) + "<i class='fa-brands fa-github'></i> GitHub" + SPACE.repeat(4) + "<i class='fa-brands fa-aws'></i> AWS");
  skills.push("<i class='fa-brands fa-microsoft'></i> Azure" + SPACE.repeat(4) + "<i class='fa-solid fa-bolt'></i> Power Automate" + SPACE.repeat(4) + "<i class='fa-brands fa-windows'></i> Power BI");
  skills.push("<i class='fa-solid fa-infinity'></i> DevOps");
  skills.push("<br>");
  
  // Other Tools
  skills.push("<span class='command'><u>Other Tools & Technologies</u></span>");
  skills.push("<i class='fa-brands fa-google'></i> Google Workspace" + SPACE.repeat(4) + "<i class='fa-solid fa-robot'></i> Generative AI" + SPACE.repeat(4) + "<i class='fa-solid fa-film'></i> Video Editing");
  skills.push("<i class='fa-brands fa-youtube'></i> Content Creation" + SPACE.repeat(4) + "<i class='fa-solid fa-laptop'></i> Hardware" + SPACE.repeat(4) + "<i class='fa-solid fa-microchip'></i> BIOS");
  skills.push("<i class='fa-solid fa-palette'></i> Canva");
  skills.push("<br>");
  skills.push("―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――");
  skills.push("<br>");
  
  // Soft Skills
  skills.push("<span class='command'><u>Soft Skills</u></span>");
  skills.push("<i class='fa-solid fa-users'></i> Team Working" + SPACE.repeat(4) + "<i class='fa-solid fa-medal'></i> Disciplined");
  skills.push("<i class='fa-solid fa-clock'></i> Patient" + SPACE.repeat(4) + "<i class='fa-solid fa-smile'></i> Easygoing");
  skills.push("<br>");
  skills.push("―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――");
  skills.push("<br>");
  
  // Languages
  skills.push("<span class='command'><u>Languages</u></span>");
  skills.push("🇬🇧 English .......... 95%");
  skills.push("🇫🇷 French ........... 90%");
  skills.push("🇵🇹 Portuguese ....... 85%");
  skills.push("🇪🇸 Spanish .......... 70%");
  skills.push("<br>");
  
  return skills;
}

export const SKILLS = createSkills();
