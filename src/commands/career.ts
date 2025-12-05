import { t } from '../translations';

export const createCareer = () : string[] => {
  const career : string[] = [];
  const SPACE = "&nbsp;";

  career.push("<br>");
  
  // Job title and company
  career.push("<span class='command'>" + t().career.title + "</span>");
  career.push(t().career.company);
  career.push("<br>");
  
  // Employment details
  career.push(t().career.period);
  career.push(t().career.location);
  career.push("<br>");
  
  // Description
  career.push(t().career.description1);
  career.push(t().career.description2);
  career.push("<br>");
  
  // Technologies
  career.push("<span class='command'>" + t().career.technologies + "</span>");
  career.push("Angular" + SPACE.repeat(4) + ".NET" + SPACE.repeat(4) + "C#");
  career.push("MariaDB" + SPACE.repeat(4) + "SQL" + SPACE.repeat(4) + "DevOps");
  career.push("PrimeNG" + SPACE.repeat(4) + "Git");
  career.push("<br>");
  
  return career;
}

export const CAREER = createCareer();
