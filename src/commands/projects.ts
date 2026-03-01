// Project data structure
export interface ProjectData {
  id: string;
  title: string;
  year: string;
  status?: string;
  shortDescription: string;
  fullDescription: string[];
  achievements: string[];
  technologies: string[];
  repository: string[];
}

// All project details
export const PROJECT_DETAILS: ProjectData[] = [
  {
    id: 'gsb-webapp',
    title: 'GSB Web App',
    year: '2025',
    shortDescription: "Full-stack bill management app - <i class='fa-brands fa-angular'></i> <i class='fa-brands fa-node-js'></i> <i class='fa-solid fa-leaf'></i> <i class='fa-brands fa-aws'></i>",
    fullDescription: [
      'A comprehensive bill management application designed for employees and',
      'administrators. Built as part of a school examination project, it demonstrates',
      'full-stack development skills with separate frontend and backend repositories.',
      'The application manages expense reports, user authentication, and oversight.'
    ],
    achievements: [
      '• Full-stack development with modern architecture',
      '• Angular frontend expertise with responsive design',
      '• Node.js backend with MongoDB integration',
      '• AWS deployment and cloud infrastructure'
    ],
    technologies: [
      "<i class='fa-brands fa-angular'></i> Angular&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-brands fa-node-js'></i> Node.js&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-leaf'></i> MongoDB",
      "<i class='fa-brands fa-aws'></i> AWS"
    ],
    repository: [
      "<a href='https://github.com/jalmeida17/bts-gsbfrontend-angular' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/bts-gsbfrontend-angular</a>",
      "<a href='https://github.com/jalmeida17/bts-gsbbackend' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/bts-gsbbackend</a>"
    ]
  },
  {
    id: 'gsb-winform',
    title: 'GSB Winform',
    year: '2025',
    shortDescription: "Medical prescription management system - <i class='fa-solid fa-code'></i> <i class='fa-solid fa-hashtag'></i> <i class='fa-solid fa-database'></i> <i class='fa-brands fa-docker'></i>",
    fullDescription: [
      'A Windows Forms desktop application for managing medical prescriptions,',
      'patient records, and pharmaceutical databases. Built as part of a BTS',
      'educational project demonstrating database design, CRUD operations, and',
      'enterprise application architecture with role-based access control.'
    ],
    achievements: [
      '• Secure authentication with SHA2-256 encryption',
      '• Professional PDF prescription export with iText7',
      '• Docker containerization for database services',
      '• Comprehensive patient and medicine management'
    ],
    technologies: [
      "<i class='fa-solid fa-code'></i> .NET 8.0&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-hashtag'></i> C#&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-database'></i> MySQL",
      "<i class='fa-brands fa-docker'></i> Docker&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-file-pdf'></i> PDF Generation"
    ],
    repository: [
      "<a href='https://github.com/jalmeida17/bts-gsb-winform' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/bts-gsb-winform</a>"
    ]
  },
  {
    id: 'webshell-portfolio',
    title: 'WebShell Portfolio',
    year: '2025',
    shortDescription: "Interactive Ubuntu terminal portfolio - <i class='fa-brands fa-js'></i> <i class='fa-brands fa-html5'></i> <i class='fa-brands fa-css3-alt'></i> <i class='fa-solid fa-fire'></i>",
    fullDescription: [
      "An Ubuntu-themed terminal portfolio website you're viewing right now!",
      'Features an interactive command-line interface with multiple terminal',
      'windows, RSS news integration, and a fully responsive Ubuntu desktop',
      'simulation. Demonstrates advanced CSS, TypeScript, and creative web design.'
    ],
    achievements: [
      '• Pixel-perfect Ubuntu desktop simulation',
      '• Interactive multi-window terminal system',
      '• RSS feed integration for live news',
      '• Custom command-line interface with easter eggs'
    ],
    technologies: [
      "<i class='fa-brands fa-js'></i> TypeScript&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-brands fa-html5'></i> HTML5&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-brands fa-css3-alt'></i> CSS3",
      "<i class='fa-solid fa-fire'></i> Vite"
    ],
    repository: [
      "<a href='https://github.com/jalmeida17/webshell-portfolio' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/webshell-portfolio</a>"
    ]
  },
  {
    id: 'fretclauger',
    title: 'FretClauger - Transport Request Management System',
    year: '2025',
    status: 'CLAUGER',
    shortDescription: "Internal transportation & freight management system - <i class='fa-brands fa-angular'></i> <i class='fa-solid fa-code'></i> <i class='fa-solid fa-database'></i> <i class='fa-brands fa-docker'></i>",
    fullDescription: [
      'FretClauger is a full-stack web application designed to streamline and manage',
      'transportation requests within Clauger. The system allows users to create, track,',
      'and manage freight transport requests with detailed information including pickup/delivery',
      'locations, merchandise details, contact management, project tracking, and carrier coordination.'
    ],
    achievements: [
      '• Full-featured transport request workflow with pickup and delivery management',
      '• Integration with Azure Entra ID (MSAL) for secure authentication',
      '• Admin interface for managing transport suppliers, contacts, and agencies',
      '• Multi-language support (i18n) using Transloco with dynamic language switching',
      '• Project/sub-project/activity tracking for cost allocation and reporting',
      '• PDF export functionality and email template generation',
      '• Responsive UI with PrimeNG and comprehensive Swagger API documentation'
    ],
    technologies: [
      "<i class='fa-brands fa-angular'></i> Angular 19&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-code'></i> .NET Core&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-database'></i> SQL Server",
      "<i class='fa-brands fa-docker'></i> Docker&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-brands fa-microsoft'></i> Azure Entra ID&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-file-pdf'></i> PDF Export"
    ],
    repository: []
  },
  {
    id: 'raw-fitness',
    title: 'RAW - Fitness Tracker & Social Platform',
    year: '2025',
    status: 'In Progress',
    shortDescription: "Bodybuilding workouts & macros tracking with social features - <i class='fa-brands fa-react'></i> <i class='fa-brands fa-node-js'></i> <i class='fa-solid fa-database'></i> <i class='fa-brands fa-docker'></i>",
    fullDescription: [
      'A comprehensive full-stack fitness application that combines workout tracking,',
      'macro nutrition monitoring, and social networking features. RAW enables users to',
      'log daily workouts, track nutritional macros, monitor progression over time, and',
      'connect with friends to share fitness journeys and achievements.'
    ],
    achievements: [
      '• Integrated workout logging with progression analytics',
      '• Real-time macro nutrition tracking and calculations',
      '• Rep max calculator and strength progression metrics',
      '• Social feed featuring friend activity and achievements',
    ],
    technologies: [
      "<i class='fa-brands fa-react'></i> React&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-brands fa-node-js'></i> Node.js&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-database'></i> MySQL",
      "<i class='fa-brands fa-docker'></i> Docker"
    ],
    repository: [
      "<a href='https://github.com/jalmeida17/StayRaw' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/StayRaw</a>"
    ]
  },
  {
    id: 'threejs-portfolio',
    title: 'Three.js Portfolio Prototype',
    year: '2025',
    status: 'Unfinished',
    shortDescription: "Experimental 3D portfolio with WoW assets - <i class='fa-brands fa-react'></i> <i class='fa-solid fa-cube'></i> <i class='fa-solid fa-gamepad'></i>",
    fullDescription: [
      'An experimental 3D portfolio using World of Warcraft assets and Three.js.',
      'This project showcases advanced 3D web development techniques by integrating',
      'WoW.tools assets to build immersive interactive environments. Currently on',
      'hold but demonstrates innovative approach to portfolio design.'
    ],
    achievements: [
      '• Immersive 3D web experience with Three.js',
      "• Integration with WoW.tools API for game assets",
      '• Advanced 3D rendering and optimization techniques',
      '• Innovative portfolio concept and design'
    ],
    technologies: [
      "<i class='fa-brands fa-react'></i> React&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-cube'></i> Three.js&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-gamepad'></i> WoW.tools"
    ],
    repository: [
      "<a href='https://github.com/jalmeida17/wow-portfolio' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/wow-portfolio</a>"
    ]
  }
];

// Create simple project list for terminal display
export const createProjects = (): string[] => {
  const projects: string[] = [];

  projects.push("<br>");

  PROJECT_DETAILS.forEach((project, index) => {
    let statusBadge = '';
    if (project.status) {
      const statusColor = project.status === 'CLAUGER' ? '#298FDD' : '#FFA500';
      statusBadge = `<span style='color: ${statusColor};'> [${project.status}]</span>`;
    }
    projects.push(
      `${index + 1}. <span class='project-link command ' data-project-id='${project.id}' style=' cursor: pointer; text-decoration: underline;'>${project.title}</span>${statusBadge} (${project.year})`
    );
    projects.push(`   ${project.shortDescription}`);
    projects.push("<br>");
  });


  return projects;
};

export const PROJECTS = createProjects();
