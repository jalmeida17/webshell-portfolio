export const createSkills = () : string[] => {
  const skills : string[] = [];
  const SPACE = "&nbsp;";

  
  // Technical Skills Section
  skills.push("<span class='command'>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>");
  skills.push("<span class='command'>TECHNICAL SKILLS</span>");
  skills.push("<span class='command'>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>");
  skills.push("<br>");

  // Programming Languages
  skills.push("<span class='command'>Programming Languages:</span>");
  skills.push("<i class='fa-brands fa-js'></i> JavaScript" + SPACE.repeat(4) + "<i class='fa-brands fa-js'></i> TypeScript" + SPACE.repeat(4) + "<i class='fa-solid fa-hashtag'></i> C#");
  skills.push("<i class='fa-brands fa-python'></i> Python" + SPACE.repeat(4) + "<i class='fa-brands fa-html5'></i> HTML" + SPACE.repeat(4) + "<i class='fa-brands fa-css3-alt'></i> CSS");
  skills.push("<i class='fa-solid fa-database'></i> SQL");
  skills.push("<br>");

  // Frameworks & Libraries
  skills.push("<span class='command'>Frameworks & Libraries:</span>");
  skills.push("<i class='fa-brands fa-react'></i> React.js" + SPACE.repeat(4) + "<i class='fa-brands fa-node-js'></i> Node.js" + SPACE.repeat(4) + "<i class='fa-brands fa-angular'></i> Angular CLI");
  skills.push("<i class='fa-solid fa-code'></i> ASP.NET Web API" + SPACE.repeat(4) + "<i class='fa-solid fa-layer-group'></i> PrimeNG");
  skills.push("<br>");

  // Tools & Platforms
  skills.push("<span class='command'>Tools & Platforms:</span>");
  skills.push("<i class='fa-brands fa-git-alt'></i> Git" + SPACE.repeat(4) + "<i class='fa-brands fa-github'></i> GitHub" + SPACE.repeat(4) + "<i class='fa-solid fa-leaf'></i> MongoDB");
  skills.push("<i class='fa-brands fa-aws'></i> AWS" + SPACE.repeat(4) + "<i class='fa-brands fa-microsoft'></i> Azure" + SPACE.repeat(4) + "<i class='fa-solid fa-bolt'></i> Power Automate");
  skills.push("<i class='fa-brands fa-windows'></i> Power BI" + SPACE.repeat(4) + "<i class='fa-brands fa-google'></i> Google Workspace");
  skills.push("<br>");

  // Creative & Content Tools
  skills.push("<span class='command'>Creative & Content Tools:</span>");
  skills.push("<i class='fa-solid fa-film'></i> Wondershare Filmora" + SPACE.repeat(4) + "<i class='fa-solid fa-video'></i> CapCut" + SPACE.repeat(4) + "<i class='fa-solid fa-palette'></i> Canva");
  skills.push("<i class='fa-solid fa-paintbrush'></i> Paint .NET" + SPACE.repeat(4) + "<i class='fa-brands fa-youtube'></i> YouTube" + SPACE.repeat(4) + "<i class='fa-solid fa-dollar-sign'></i> AdSense");
  skills.push("<br>");

  // Hardware & Systems
  skills.push("<span class='command'>Hardware & Systems:</span>");
  skills.push("<i class='fa-solid fa-microchip'></i> BIOS" + SPACE.repeat(4) + "<i class='fa-solid fa-laptop'></i> PC & Laptop Refurbishing");
  skills.push("<i class='fa-solid fa-screwdriver-wrench'></i> PC & Laptop Upgrading" + SPACE.repeat(4) + "<i class='fa-solid fa-compact-disc'></i> Operating System Installation");
  skills.push("<br>");

  // AI & Emerging Tech
  skills.push("<span class='command'>AI & Emerging Technologies:</span>");
  skills.push("<i class='fa-solid fa-robot'></i> Generative AI Tools");
  skills.push("<br>");

  // Soft Skills Section
  skills.push("<span class='command'>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>");
  skills.push("<span class='command'>SOFT SKILLS</span>");
  skills.push("<span class='command'>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>");
  skills.push("<br>");

  skills.push("<i class='fa-solid fa-users'></i> Team Working");
  skills.push("Collaborative problem-solving and communication");
  skills.push("<br>");
  
  skills.push("<i class='fa-solid fa-medal'></i> Disciplined");
  skills.push("Focused and methodical approach to work");
  skills.push("<br>");
  
  skills.push("<i class='fa-solid fa-clock'></i> Patient");
  skills.push("Persistent in solving complex problems");
  skills.push("<br>");
  
  skills.push("<i class='fa-solid fa-smile'></i> Easygoing");
  skills.push("Adaptable and flexible in dynamic environments");
  skills.push("<br>");

  // Languages Section
  skills.push("<span class='command'>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>");
  skills.push("<span class='command'>LANGUAGES</span>");
  skills.push("<span class='command'>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>");
  skills.push("<br>");

  skills.push("🇬🇧 English" + SPACE.repeat(8) + "<span style='color: #4AF626;'>95%</span>");
  skills.push(SPACE.repeat(3) + "Fluent speaker");
  skills.push("<br>");
  
  skills.push("🇫🇷 French" + SPACE.repeat(8) + "<span style='color: #4AF626;'>90%</span>");
  skills.push(SPACE.repeat(3) + "Professional proficiency");
  skills.push("<br>");
  
  skills.push("🇵🇹 Portuguese" + SPACE.repeat(4) + "<span style='color: #4AF626;'>85%</span>");
  skills.push(SPACE.repeat(3) + "Native proficiency");
  skills.push("<br>");
  
  skills.push("🇪🇸 Spanish" + SPACE.repeat(7) + "<span style='color: #4AF626;'>70%</span>");
  skills.push(SPACE.repeat(3) + "Conversational proficiency");
  skills.push("<br>");
  
  return skills;
}

export const SKILLS = createSkills();
