export const createCareer = () : string[] => {
  const career : string[] = [];
  const SPACE = "&nbsp;";

  career.push("<br>");
  
  // Job title and company
  career.push("<span class='command' style='font-size: 20px; text-decoration: underline;'>Full Stack Developer - Internship</span>");
  career.push("<br>");
  // Employment details
  career.push("<span class='command'>CLAUGER</span>");
  career.push("August 2024 - Present");
  career.push("Brignais, Auvergne-Rhône-Alpes, France");
  career.push("<br>");
  
  // Description
  career.push("Fullstack Developer at Clauger, focused on developing and maintaining");
  career.push("web applications using modern technologies.");
  career.push("<br>");

  // Projects
  career.push("<span class='command'>Projects:</span>");
  career.push("• Development of a internal web application for merchandise transport.");
  career.push("• Currently building a cyber security education platform.");
  career.push("• Automation of data processing tasks.");
  career.push("• And many other little projects...");
  career.push("<br>");
  
  // Technologies
  career.push("<span class='command'>Technologies:</span>");
  career.push("<i class='fa-brands fa-angular'></i> Angular" + SPACE.repeat(4) + "<i class='fa-solid fa-code'></i> .NET" + SPACE.repeat(4) + "<i class='fa-solid fa-hashtag'></i> C#");
  career.push("<i class='fa-solid fa-database'></i> MariaDB" + SPACE.repeat(4) + "<i class='fa-solid fa-database'></i> SQL" + SPACE.repeat(4) + "<i class='fa-solid fa-infinity'></i> DevOps");
  career.push("<i class='fa-solid fa-layer-group'></i> PrimeNG" + SPACE.repeat(4) + "<i class='fa-brands fa-git-alt'></i> Git");
  career.push("<i class='fa-brands fa-microsoft'></i> Azure" + SPACE.repeat(4) + "<i class='fa-solid fa-bolt'></i> Power Automate" + SPACE.repeat(4) + "<i class='fa-brands fa-windows'></i> Power BI");
  career.push("<br>");
  
  return career;
}

export const CAREER = createCareer();
