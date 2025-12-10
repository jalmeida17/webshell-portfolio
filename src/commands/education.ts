export const createEducation = () : string[] => {
  const education : string[] = [];
  const SPACE = "&nbsp;";

  education.push("<br>");
  
  // First education entry
  education.push("<span class='command' style='font-size: 20px; text-decoration: underline;'>BTS SIO - SLAM</span>");
  education.push("NEXA DIGITAL SCHOOL");
  education.push("<br>");
  
  education.push("<span class='command'>2024-2026</span>");
  education.push("Lyon, Auvergne-Rhône-Alpes, France");
  education.push("<br>");
  
  education.push("Two-year technical degree in IT with a specialization in Software");
  education.push("Solutions and Business Applications (SLAM). Gained solid experience in");
  education.push("software development, databases, web technologies, and project management,");
  education.push("with a strong focus on practical, real-world applications.");
  education.push("<br>");
  
  education.push("<span class='command'>Achievements:</span>");
  education.push("• Developed a full-stack bill manager web application");
  education.push("• Developed a winforms application to manage medical prescriptions.");
  education.push("• Currently building a gym social network platform.");
  education.push("• And other less important school projects...");
  education.push("<br>");
  
  education.push("<span class='command'>Key Courses:</span>");
  education.push("<i class='fa-brands fa-react'></i> React" + SPACE.repeat(4) + "<i class='fa-brands fa-git-alt'></i> Git" + SPACE.repeat(4) + "<i class='fa-solid fa-database'></i> SQL");
  education.push("<i class='fa-brands fa-node-js'></i> Node.js" + SPACE.repeat(4) + "<i class='fa-brands fa-aws'></i> AWS & MongoDB" + SPACE.repeat(4) + "<i class='fa-solid fa-shield-halved'></i> Cybersecurity");
  education.push("<i class='fa-solid fa-diagram-project'></i> Software Project Management");
  education.push("<br>");
  education.push("―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――");
  education.push("<br>");
  
  // Second education entry
  education.push("<span class='command' style='font-size: 20px; text-decoration: underline;'>BAC Général - NSI & AMC (European Section)</span>");
  education.push("Lycée Polyvalent Aragon Picasso");
  education.push("<br>");
  
  education.push("<span class='command'>2023-2024</span>");
  education.push("Givors, Auvergne-Rhône-Alpes, France");
  education.push("<br>");
  
  education.push("General Baccalauréat with a focus on Computer Science (NSI) and Global");
  education.push("English Studies (AMC), including a European section in English. Developed");
  education.push("strong foundations in IT, programming, and intercultural communication.");
  education.push("<br>");
  
  education.push("<span class='command'>Achievements:</span>");
  education.push("• Mostly self-taught in English and Spanish");
  education.push("• Improved technical English skills through the European section");
  education.push("• Active participation in school team coding projects");
  education.push("<br>");
  
  education.push("<span class='command'>Key Courses:</span>");
  education.push("<i class='fa-solid fa-code'></i> Programming Fundamentals" + SPACE.repeat(4) + "<i class='fa-solid fa-globe'></i> Web Development Basics");
  education.push("<i class='fa-solid fa-cube'></i> Object-Oriented Programming" + SPACE.repeat(4) + "<i class='fa-solid fa-database'></i> Databases Intro");
  education.push("<i class='fa-solid fa-network-wired'></i> Networks Introduction" + SPACE.repeat(4) + "<i class='fa-solid fa-book'></i> English History & Culture");
  education.push("<br>");
  
  return education;
}

export const EDUCATION = createEducation();
