export const createCareer = () : string[] => {
  const career : string[] = [];
  const SPACE = "&nbsp;";

  career.push("<br>");
  
  // Job title and company
  career.push("<span class='command'>Full Stack Developer - Internship</span>");
  career.push("<img src='/res/logo-clauger.png' style='width: 100px; height: 30px; object-fit: contain; background: white; padding: 8px; border-radius: 8px; vertical-align: middle; margin-top: 20px; margin-bottom: 5px; display: inline-block;'>");
  career.push("<br>");
  // Employment details
  career.push("August 2024 - Present");
  career.push("Brignais, Auvergne-Rhône-Alpes, France");
  career.push("<br>");
  
  // Description
  career.push("Fullstack Developer at Clauger, focused on developing and maintaining");
  career.push("web applications using modern technologies.");
  career.push("<br>");
  
  // Technologies
  career.push("<span class='command'>Technologies:</span>");
  career.push("Angular" + SPACE.repeat(4) + ".NET" + SPACE.repeat(4) + "C#");
  career.push("MariaDB" + SPACE.repeat(4) + "SQL" + SPACE.repeat(4) + "DevOps");
  career.push("PrimeNG" + SPACE.repeat(4) + "Git");
  career.push("<br>");
  
  return career;
}

export const CAREER = createCareer();
