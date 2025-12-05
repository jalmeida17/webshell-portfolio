export interface Translations {
  banner: {
    welcome: string;
    typeHelp: string;
  };
  help: {
    commands: Array<[string, string]>;
  };
  about: {
    greeting: string;
    email: string;
    github: string;
    linkedin: string;
    discord: string;
    steam: string;
    phone: string;
  };
  projects: {
    files: string;
  };
  career: {
    title: string;
    company: string;
    period: string;
    location: string;
    description1: string;
    description2: string;
    technologies: string;
  };
  default: {
    notFound: string;
    typeHelp: string;
  };
  sudo: {
    permissionGranted: string;
    tryRmRf: string;
    permissionNotGranted: string;
    incorrectPassword: string;
  };
  ls: {
    permissionNotGranted: string;
  };
  rmRf: {
    usage: string;
    permissionNotGranted: string;
    directoryNotFound: string;
    typeLS: string;
  };
  easterEgg: {
    badIdea: string;
    ruined: string;
    noSrcFolder: string;
    whatElse: string;
    dontTry: string;
    typeHelp: string;
    nothing: string;
    noProjects: string;
    no: string;
  };
  languageSelection: {
    prompt: string;
    english: string;
    french: string;
    invalid: string;
  };
  languageChange: {
    currentLanguage: string;
    switchedTo: string;
    usage: string;
  };
}

export const translations: Record<string, Translations> = {
  en: {
    banner: {
      welcome: "Welcome to my Portfolio",
      typeHelp: "Type <span class='command'>'help'</span> for a list of all available commands.",
    },
    help: {
      commands: [
        ["'about'", "Who made this website?"],
        ["'projects'", "Maybe there's something interesting."],
        ["'career'", "View my professional experience."],
        ["'sudo'", "???"],
        ["'banner'", "Display the banner."],
        ["'clear'", "Clear the terminal."],
        ["'lang'", "Change language (en/fr)."],
      ],
    },
    about: {
      greeting: "Hi, I'm Joao ! I'm a Full Stack Developer passionate about coding and tech in general.",
      email: "Email",
      github: "Github",
      linkedin: "Linkedin",
      discord: "Discord",
      steam: "Steam",
      phone: "Phone"
    },
    projects: {
      files: "File(s)",
    },
    career: {
      title: "Full Stack Developer - Internship",
      company: "Clauger",
      period: "August 2024 - Present",
      location: "Brignais, Auvergne-Rhône-Alpes, France",
      description1: "Fullstack Developer at Clauger, focused on developing and maintaining",
      description2: "web applications using modern technologies.",
      technologies: "Technologies:",
    },
    default: {
      notFound: "Command not found.",
      typeHelp: "Type <span class='command'>'help'</span> to see list of available commands.",
    },
    sudo: {
      permissionGranted: "PERMISSION GRANTED.",
      tryRmRf: "Try <span class='command'>'rm -rf'</span>",
      permissionNotGranted: "Permission not granted.",
      incorrectPassword: "INCORRECT PASSWORD.",
    },
    ls: {
      permissionNotGranted: "Permission not granted.",
    },
    rmRf: {
      usage: "Usage: <span class='command'>'rm -rf &lt;dir&gt;'</span>",
      permissionNotGranted: "Permission not granted.",
      directoryNotFound: "Directory not found.",
      typeLS: "type <span class='command'>'ls'</span> for a list of directories.",
    },
    easterEgg: {
      badIdea: "What made you think that was a good idea?",
      ruined: "Now everything is ruined.",
      noSrcFolder: "there's no more src folder.",
      whatElse: "What else are you trying to delete?",
      dontTry: "don't try again.",
      typeHelp: "Do you really think this is going to work now? Refresh your damn browser!",
      nothing: "Nothing to see here.",
      noProjects: "I don't want you to break the other projects.",
      no: "no.",
    },
    languageSelection: {
      prompt: "Please select a language / Veuillez sélectionner une langue:",
      english: "English",
      french: "French / Français",
      invalid: "Invalid selection. Please type 'en' or 'fr'.",
    },
    languageChange: {
      currentLanguage: "Current language: English",
      switchedTo: "Language switched to English",
      usage: "Usage: <span class='command'>'lang en'</span> or <span class='command'>'lang fr'</span>",
    },
  },
  fr: {
    banner: {
      welcome: "Bienvenue sur mon Portfolio",
      typeHelp: "Tapez <span class='command'>'help'</span> pour la liste des commandes disponibles.",
    },
    help: {
      commands: [
        ["'about'", "Qui a créé ce site web ?"],
        ["'projects'", "Peut-être qu'il y a quelque chose d'intéressant."],
        ["'career'", "Voir mon expérience professionnelle."],
        ["'sudo'", "???"],
        ["'banner'", "Afficher la bannière."],
        ["'clear'", "Effacer le terminal."],
        ["'lang'", "Changer la langue (en/fr)."],
      ],
    },
    about: {
      greeting: "Salut, je suis Joao ! Je suis un développeur Full Stack passionné par l'informatique.",
      email: "Email",
      github: "Github",
      linkedin: "Linkedin",
      discord: "Discord",
      steam: "Steam",
      phone: "Téléphone"
    },
    projects: {
      files: "Fichier(s)",
    },
    career: {
      title: "Développeur Full Stack - Alternance",
      company: "Clauger",
      period: "Août 2024 - Présent",
      location: "Brignais, Auvergne-Rhône-Alpes, France",
      description1: "Développeur Fullstack chez Clauger, axé sur le développement et la maintenance",
      description2: "d'applications web utilisant des technologies modernes.",
      technologies: "Technologies :",
    },
    default: {
      notFound: "Commande introuvable.",
      typeHelp: "Tapez <span class='command'>'help'</span> pour voir la liste des commandes disponibles.",
    },
    sudo: {
      permissionGranted: "PERMISSION ACCORDÉE.",
      tryRmRf: "Essayez <span class='command'>'rm -rf'</span>",
      permissionNotGranted: "Permission refusée.",
      incorrectPassword: "MOT DE PASSE INCORRECT.",
    },
    ls: {
      permissionNotGranted: "Permission refusée.",
    },
    rmRf: {
      usage: "Utilisation : <span class='command'>'rm -rf &lt;dir&gt;'</span>",
      permissionNotGranted: "Permission refusée.",
      directoryNotFound: "Répertoire introuvable.",
      typeLS: "tapez <span class='command'>'ls'</span> pour la liste des répertoires.",
    },
    easterEgg: {
      badIdea: "Qu'est-ce qui t'a fait penser que c'était une bonne idée ?",
      ruined: "Maintenant tout est ruiné.",
      noSrcFolder: "il n'y a plus de dossier src.",
      whatElse: "Qu'est-ce que tu essaies encore de supprimer ?",
      dontTry: "n'essaie plus.",
      typeHelp: "Tu penses vraiment que ça va marcher maintenant ? Rafraîchis ton foutu navigateur !",
      nothing: "Rien à voir ici.",
      noProjects: "Je ne veux pas que tu casses les autres projets.",
      no: "non.",
    },
    languageSelection: {
      prompt: "Please select a language / Veuillez sélectionner une langue:",
      english: "English",
      french: "French / Français",
      invalid: "Sélection invalide. Veuillez taper 'en' ou 'fr'.",
    },
    languageChange: {
      currentLanguage: "Langue actuelle : Français",
      switchedTo: "Langue changée en Français",
      usage: "Utilisation : <span class='command'>'lang en'</span> ou <span class='command'>'lang fr'</span>",
    },
  },
};

export let currentLanguage: string = 'en';

export function setLanguage(lang: string): void {
  if (translations[lang]) {
    currentLanguage = lang;
  }
}

export function getCurrentLanguage(): string {
  return currentLanguage;
}

export function t(): Translations {
  return translations[currentLanguage];
}
