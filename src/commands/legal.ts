export const createLegal = () : string[] => {
  const legal : string[] = [];
  const SPACE = "&nbsp;";

  const row = (label : string, value : string) => {
    let s = "";
    s += SPACE.repeat(2);
    s += `<span class='command'>${label}</span>`;
    s += SPACE.repeat(Math.max(1, 18 - label.length));
    s += value;
    return s;
  };

  legal.push("<br>");
  legal.push("<span class='command'>== MENTIONS LEGALES ==</span>");
  legal.push("<br>");

  legal.push("<span class='command'>// EDITEUR DU SITE</span>");
  legal.push(row("Nom", "Joao Miguel Almeida Santos"));
  legal.push(row("Statut", "Etudiant"));
  legal.push(row("Email", "<a target='_blank' href='mailto:joa.almeidasantos@gmail.com'>joa.almeidasantos@gmail.com</a>"));
  legal.push("<br>");

  legal.push("<span class='command'>// DIRECTEUR DE PUBLICATION</span>");
  legal.push(row("Nom", "Joao Miguel Almeida Santos"));
  legal.push("<br>");

  legal.push("<span class='command'>// HEBERGEUR</span>");
  legal.push(row("Societe", "Vercel Inc."));
  legal.push(row("Adresse", "440 N Barranca Avenue #4133, Covina, CA 91723, USA"));
  legal.push(row("Site", "<a target='_blank' href='https://vercel.com'>vercel.com</a>"));
  legal.push("<br>");

  legal.push("<span class='command'>// PROPRIETE INTELLECTUELLE</span>");
  legal.push("&nbsp;&nbsp;Le code source de ce site est disponible publiquement");
  legal.push("&nbsp;&nbsp;sous la licence du depot GitHub :");
  legal.push("&nbsp;&nbsp;<a target='_blank' href='https://github.com/jalmeida17/webshell-portfolio'>github.com/jalmeida17/webshell-portfolio</a>");
  legal.push("&nbsp;&nbsp;Les contenus (textes, images, CV) restent la propriete");
  legal.push("&nbsp;&nbsp;de leur auteur.");
  legal.push("<br>");

  legal.push("<span class='command'>// DONNEES PERSONNELLES</span>");
  legal.push("&nbsp;&nbsp;Ce site est purement vitrine : aucune donnee personnelle");
  legal.push("&nbsp;&nbsp;n'est collectee, stockee ou transmise. Aucun cookie de");
  legal.push("&nbsp;&nbsp;tracking ni outil d'analyse n'est utilise.");
  legal.push("<br>");

  legal.push("<span class='command'>// CONTACT</span>");
  legal.push("&nbsp;&nbsp;Pour toute question relative aux presentes mentions,");
  legal.push("&nbsp;&nbsp;contactez : <a target='_blank' href='mailto:joa.almeidasantos@gmail.com'>joa.almeidasantos@gmail.com</a>");
  legal.push("<br>");

  return legal;
};

export const LEGAL = createLegal();
