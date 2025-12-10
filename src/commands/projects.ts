export const createProjects = () : string[] => {
  const projects : string[] = [];
  const SPACE = "&nbsp;";

  projects.push("<br>");
  
  // Project 1: Galaxy Swiss Bourdin
  projects.push("<span class='command' style='font-size: 20px; text-decoration: underline;'>GSB Web App</span>");
  projects.push("<br>");
  projects.push("<span class='command'>2024 - Solo Project</span>");
  projects.push("<br>");
  projects.push("A comprehensive bill management application designed for employees and");
  projects.push("administrators. Built as part of a school examination project, it demonstrates");
  projects.push("full-stack development skills with separate frontend and backend repositories.");
  projects.push("The application manages expense reports, user authentication, and oversight.");
  projects.push("<br>");
  
  projects.push("<span class='command'>Key Achievements:</span>");
  projects.push("• Full-stack development with modern architecture");
  projects.push("• Angular frontend expertise with responsive design");
  projects.push("• Node.js backend with MongoDB integration");
  projects.push("• AWS deployment and cloud infrastructure");
  projects.push("<br>");
  
  projects.push("<span class='command'>Technologies:</span>");
  projects.push("<i class='fa-brands fa-angular'></i> Angular" + SPACE.repeat(4) + "<i class='fa-brands fa-node-js'></i> Node.js" + SPACE.repeat(4) + "<i class='fa-solid fa-leaf'></i> MongoDB");
  projects.push("<i class='fa-brands fa-aws'></i> AWS");
  projects.push("<br>");
  
  projects.push("<span class='command'>Repository:</span>");
  projects.push("<a href='https://github.com/jalmeida17/bts-gsbfrontend-angular' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/bts-gsbfrontend-angular</a>");
  projects.push("<a href='https://github.com/jalmeida17/bts-gsbbackend' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/bts-gsbbackend</a>");
  projects.push("<br>");
  projects.push("―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――");
  projects.push("<br>");
  
  // Project 2: Medical Prescription Management System
  projects.push("<span class='command' style='font-size: 20px; text-decoration: underline;'>GSB Winform</span>");
  projects.push("<br>");
  projects.push("<span class='command'>2024 - Solo Project</span>");
  projects.push("<br>");
  projects.push("A Windows Forms desktop application for managing medical prescriptions,");
  projects.push("patient records, and pharmaceutical databases. Built as part of a BTS");
  projects.push("educational project demonstrating database design, CRUD operations, and");
  projects.push("enterprise application architecture with role-based access control.");
  projects.push("<br>");
  
  projects.push("<span class='command'>Key Achievements:</span>");
  projects.push("• Secure authentication with SHA2-256 encryption");
  projects.push("• Professional PDF prescription export with iText7");
  projects.push("• Docker containerization for database services");
  projects.push("• Comprehensive patient and medicine management");
  projects.push("<br>");
  
  projects.push("<span class='command'>Technologies:</span>");
  projects.push("<i class='fa-solid fa-code'></i> .NET 8.0" + SPACE.repeat(4) + "<i class='fa-solid fa-hashtag'></i> C#" + SPACE.repeat(4) + "<i class='fa-solid fa-database'></i> MySQL");
  projects.push("<i class='fa-brands fa-docker'></i> Docker" + SPACE.repeat(4) + "<i class='fa-solid fa-file-pdf'></i> PDF Generation");
  projects.push("<br>");
  
  projects.push("<span class='command'>Repository:</span>");
  projects.push("<a href='https://github.com/jalmeida17/bts-gsb-winform' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/bts-gsb-winform</a>");
  projects.push("<br>");
  projects.push("―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――");
  projects.push("<br>");
  
  // Project 3: WebShell Portfolio
  projects.push("<span class='command' style='font-size: 20px; text-decoration: underline;'>WebShell Portfolio</span>");
  projects.push("<br>");
  projects.push("<span class='command'>2024 - Solo Project</span>");
  projects.push("<br>");
  projects.push("An Ubuntu-themed terminal portfolio website you're viewing right now!");
  projects.push("Features an interactive command-line interface with multiple terminal");
  projects.push("windows, RSS news integration, and a fully responsive Ubuntu desktop");
  projects.push("simulation. Demonstrates advanced CSS, TypeScript, and creative web design.");
  projects.push("<br>");
  
  projects.push("<span class='command'>Key Achievements:</span>");
  projects.push("• Pixel-perfect Ubuntu desktop simulation");
  projects.push("• Interactive multi-window terminal system");
  projects.push("• RSS feed integration for live news");
  projects.push("• Custom command-line interface with easter eggs");
  projects.push("<br>");
  
  projects.push("<span class='command'>Technologies:</span>");
  projects.push("<i class='fa-brands fa-js'></i> TypeScript" + SPACE.repeat(4) + "<i class='fa-brands fa-html5'></i> HTML5" + SPACE.repeat(4) + "<i class='fa-brands fa-css3-alt'></i> CSS3");
  projects.push("<i class='fa-solid fa-fire'></i> Vite");
  projects.push("<br>");
  
  projects.push("<span class='command'>Repository:</span>");
  projects.push("<a href='https://github.com/jalmeida17/webshell-portfolio' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/webshell-portfolio</a>");
  projects.push("<br>");
  projects.push("―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――");
  projects.push("<br>");
  
  // Project 4: Three.js Portfolio Prototype
  projects.push("<span class='command' style='font-size: 20px; text-decoration: underline;'>Three.js Portfolio Prototype</span>");
  projects.push("<br>");
  projects.push("<span class='command'>2024 - Solo Project - <span style='color: #FFA500;'>Unfinished</span></span>");
  projects.push("<br>");
  projects.push("An experimental 3D portfolio using World of Warcraft assets and Three.js.");
  projects.push("This project showcases advanced 3D web development techniques by integrating");
  projects.push("WoW.tools assets to build immersive interactive environments. Currently on");
  projects.push("hold but demonstrates innovative approach to portfolio design.");
  projects.push("<br>");
  
  projects.push("<span class='command'>Key Achievements:</span>");
  projects.push("• Immersive 3D web experience with Three.js");
  projects.push("• Integration with WoW.tools API for game assets");
  projects.push("• Advanced 3D rendering and optimization techniques");
  projects.push("• Innovative portfolio concept and design");
  projects.push("<br>");
  
  projects.push("<span class='command'>Technologies:</span>");
  projects.push("<i class='fa-brands fa-react'></i> React" + SPACE.repeat(4) + "<i class='fa-solid fa-cube'></i> Three.js" + SPACE.repeat(4) + "<i class='fa-solid fa-gamepad'></i> WoW.tools");
  projects.push("<br>");
  
  projects.push("<span class='command'>Repository:</span>");
  projects.push("<a href='https://github.com/jalmeida17/wow-portfolio' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/wow-portfolio</a>");
  projects.push("<br>");
  
  return projects;
}

export const PROJECTS = createProjects();
