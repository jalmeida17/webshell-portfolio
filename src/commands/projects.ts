// Project data structure — enriched for BTS SIO E4/E5 format
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
  // E4/E5 enriched fields
  context?: {
    organization: string;
    organizationDesc: string;
    role: string;
    teamSize: string;
    duration: string;
  };
  businessNeed?: string;
  approach?: string[];
  techChoices?: { name: string; icon: string; iconColor: string; justification: string }[];
  architecture?: string;
  results?: string[];
  competencies?: { bloc: string; color: string; skills: string[] }[];
  images?: string[]; // paths relative to /res/projects/{id}/
}

// All project details
export const PROJECT_DETAILS: ProjectData[] = [
  {
    id: 'fretclauger',
    title: 'FretClauger',
    year: '2024-2025',
    status: 'CLAUGER',
    shortDescription: "Internal transportation & freight management system - <i class='fa-brands fa-angular'></i> <i class='fa-solid fa-code'></i> <i class='fa-solid fa-database'></i> <i class='fa-brands fa-docker'></i>",
    fullDescription: [
      'FretClauger is a full-stack web application designed to streamline and manage',
      'transportation requests within Clauger. The system replaces an outdated PHP form',
      'that was inefficient and error-prone, providing a modern, complete solution for',
      'freight logistics coordination across the company.'
    ],
    context: {
      organization: 'Clauger',
      organizationDesc: 'International industrial refrigeration and HVAC company. Clauger designs, installs, and maintains refrigeration and air treatment systems across 20+ countries.',
      role: 'Full Stack Developer (Internship)',
      teamSize: 'Solo developer with supervisor validation',
      duration: 'Oct 2024 - Dec 2025',
    },
    businessNeed: 'The logistics department relied on an outdated PHP form to manage transport requests. This system was slow, lacked validation, had no tracking capabilities, and couldn\'t handle the complexity of multi-site freight coordination. The company needed a modern, centralized platform to create, track, and manage transport requests with carrier coordination, cost allocation, and document generation.',
    approach: [
      'Conducted needs analysis with logistics staff to map the full transport request lifecycle: creation, validation, carrier assignment, tracking, and archival.',
      'Designed a relational database schema (SQL Server) to model entities: transport requests, carriers, contacts, agencies, projects/sub-projects, and activities for cost allocation.',
      'Developed iteratively with regular supervisor validation. Started with the data model, then API endpoints, then UI components. Used PrimeNG for rapid, professional UI development.',
      'Implemented Azure Entra ID (MSAL) authentication to integrate with Clauger\'s existing Microsoft ecosystem, ensuring SSO for all employees.',
      'Added i18n support via Transloco from the start, as Clauger operates internationally with French and English-speaking users.',
    ],
    techChoices: [
      { name: 'Angular 19', icon: 'fa-brands fa-angular', iconColor: '#DD0031', justification: 'Imposed by Clauger\'s existing tech stack. Enterprise-grade framework with strong typing.' },
      { name: '.NET Core', icon: 'fa-solid fa-code', iconColor: '#512BD4', justification: 'Company standard for backend APIs. Integrates natively with Azure and SQL Server.' },
      { name: 'SQL Server', icon: 'fa-solid fa-database', iconColor: '#CC2927', justification: 'Company\'s database standard. Relational model fits the structured transport data well.' },
      { name: 'Azure Entra ID', icon: 'fa-brands fa-microsoft', iconColor: '#0078D4', justification: 'Existing SSO infrastructure at Clauger. MSAL integration for seamless employee authentication.' },
      { name: 'PrimeNG', icon: 'fa-solid fa-layer-group', iconColor: '#DD0031', justification: 'Rich UI component library for Angular. Accelerated development of tables, forms, and dialogs.' },
      { name: 'Transloco', icon: 'fa-solid fa-language', iconColor: '#059669', justification: 'Runtime i18n for Angular. Supports dynamic language switching for international users.' },
      { name: 'Docker', icon: 'fa-brands fa-docker', iconColor: '#2496ED', justification: 'Containerized deployment for consistent dev/staging/prod environments.' },
    ],
    architecture: 'Client-server architecture: Angular SPA communicates with a .NET Core REST API. The API connects to SQL Server for persistence and Azure Entra ID for authentication. Docker containers for deployment. Swagger for API documentation.',
    achievements: [
      '• Full-featured transport request workflow with pickup and delivery management',
      '• Integration with Azure Entra ID (MSAL) for secure authentication',
      '• Admin interface for managing transport suppliers, contacts, and agencies',
      '• Multi-language support (i18n) using Transloco with dynamic language switching',
      '• Project/sub-project/activity tracking for cost allocation and reporting',
      '• PDF export functionality and email template generation',
      '• Responsive UI with PrimeNG and comprehensive Swagger API documentation'
    ],
    results: [
      'Successfully replaced the legacy PHP form with a modern, full-featured platform.',
      'Used daily by ~15 logistics and admin staff for transport request management.',
      'Reduced request processing errors through form validation and structured workflows.',
      'Enabled cost tracking per project/activity, previously impossible with the old system.',
      'Delivered comprehensive Swagger API documentation for future maintainability.',
    ],
    competencies: [
      { bloc: 'Bloc 1 — Support and provisioning of IT services', color: '#0891B2', skills: ['Responding to IT service requests', 'Assisting with the development of a digital presence'] },
      { bloc: 'Bloc 2 — IT infrastructure solutions', color: '#7C3AED', skills: ['Maintaining a local infrastructure', 'Deploying containerized services (Docker)'] },
      { bloc: 'Bloc 3 — Software solutions and business applications', color: '#059669', skills: ['Managing IT project data', 'Developing business solution components', 'Designing and prototyping a software solution', 'Developing a secure business solution', 'Collaborating on the integration of an IT solution'] },
    ],
    technologies: [
      "<i class='fa-brands fa-angular'></i> Angular 19&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-code'></i> .NET Core&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-database'></i> SQL Server",
      "<i class='fa-brands fa-docker'></i> Docker&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-brands fa-microsoft'></i> Azure Entra ID&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-file-pdf'></i> PDF Export"
    ],
    repository: [],
    images: [],
  },
  {
    id: 'monbureaconnecte',
    title: 'MonBureauConnecte',
    year: '2025',
    status: 'CLAUGER',
    shortDescription: "IoT building management via OPC automates - <i class='fa-brands fa-angular'></i> <i class='fa-solid fa-code'></i> <i class='fa-solid fa-database'></i> <i class='fa-brands fa-docker'></i>",
    fullDescription: [
      'MonBureauConnecte is an internal web application that allows employees to monitor',
      'and control smart building systems in real time. Users can adjust temperature,',
      'toggle lights, set light intensity, check room occupancy, and monitor window status',
      '— all powered by industrial automates connected through an OPC service chain.'
    ],
    context: {
      organization: 'Clauger',
      organizationDesc: 'International industrial refrigeration and HVAC company. Clauger designs, installs, and maintains refrigeration and air treatment systems across 20+ countries.',
      role: 'Full Stack Developer (Internship)',
      teamSize: 'Solo developer — OPC/automate layer pre-configured by infrastructure team',
      duration: 'Jan 2025 - Feb 2025',
    },
    businessNeed: 'Clauger employees had no way to directly control their office environment (temperature, lighting) without contacting facilities. The company wanted to improve employee comfort by providing a self-service web interface connected to the building\'s existing industrial automates (PLCs) via OPC protocol, letting users adjust conditions from their browser.',
    approach: [
      'Analyzed the existing OPC data flow: industrial automates write sensor data to a SQL Server database via an OPC server. My application reads and writes to this same database to send commands back.',
      'Designed the .NET API to abstract the database layer, exposing clean REST endpoints for temperature, lighting, occupancy, and window status.',
      'Built the Angular frontend with real-time data display, using polling to refresh sensor readings at regular intervals.',
      'Focused on UX simplicity: employees need intuitive controls (sliders for temperature, toggles for lights) without needing to understand the underlying automate infrastructure.',
    ],
    techChoices: [
      { name: 'Angular', icon: 'fa-brands fa-angular', iconColor: '#DD0031', justification: 'Clauger\'s standard frontend framework. Component-based architecture ideal for modular building controls.' },
      { name: '.NET', icon: 'fa-solid fa-code', iconColor: '#512BD4', justification: 'Company standard backend. Efficient DB access layer for reading/writing automate data.' },
      { name: 'SQL Server', icon: 'fa-solid fa-database', iconColor: '#CC2927', justification: 'Shared database with OPC server — the communication bridge between web app and automates.' },
      { name: 'Docker', icon: 'fa-brands fa-docker', iconColor: '#2496ED', justification: 'Containerized deployment alongside other Clauger internal services.' },
    ],
    architecture: 'Three-tier architecture: Industrial automates ↔ OPC Server ↔ SQL Server database ↔ .NET REST API ↔ Angular SPA. The database acts as a shared communication layer between the OPC world and the web application.',
    achievements: [
      '• Real-time temperature monitoring and control',
      '• Light management with intensity adjustment (sliders)',
      '• Room occupancy detection through automate sensors',
      '• Window open/close status monitoring',
      '• OPC service chain integration for industrial automate communication',
      '• Full-stack Angular/.NET architecture with Docker deployment'
    ],
    results: [
      'Delivered a functional prototype allowing employees to control office conditions from their browser.',
      'Demonstrated the feasibility of bridging web technologies with industrial OPC automation.',
      'Improved employee comfort by removing the need to contact facilities for basic adjustments.',
    ],
    competencies: [
      { bloc: 'Bloc 1 — Support and provisioning of IT services', color: '#0891B2', skills: ['Responding to incidents and assistance requests', 'Assisting with the development of a digital presence'] },
      { bloc: 'Bloc 2 — IT infrastructure solutions', color: '#7C3AED', skills: ['Administering an infrastructure', 'Maintaining a local infrastructure'] },
      { bloc: 'Bloc 3 — Software solutions and business applications', color: '#059669', skills: ['Managing IT project data', 'Developing business solution components', 'Designing and prototyping a software solution'] },
    ],
    technologies: [
      "<i class='fa-brands fa-angular'></i> Angular&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-code'></i> .NET&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-database'></i> SQL Server",
      "<i class='fa-brands fa-docker'></i> Docker&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-brands fa-microsoft'></i> Azure"
    ],
    repository: [],
    images: [],
  },
  {
    id: 'gsb-webapp',
    title: 'GSB Web App',
    year: '2025',
    shortDescription: "Full-stack bill management app - <i class='fa-brands fa-angular'></i> <i class='fa-brands fa-node-js'></i> <i class='fa-solid fa-leaf'></i> <i class='fa-brands fa-aws'></i>",
    fullDescription: [
      'A comprehensive bill management application designed for employees and',
      'administrators of the fictional pharmaceutical company Galaxy Swiss Bourdin (GSB).',
      'Built as part of the BTS SIO examination, it demonstrates full-stack development',
      'skills with separate frontend and backend repositories.'
    ],
    context: {
      organization: 'GSB (Galaxy Swiss Bourdin) — Fictional',
      organizationDesc: 'Standard BTS SIO exam scenario. GSB is a pharmaceutical company whose sales representatives submit expense reports (travel, meals, accommodation) that must be validated by accountants.',
      role: 'Solo Developer (BTS SIO exam project)',
      teamSize: 'Solo',
      duration: 'Jan 2025 - Mar 2025',
    },
    businessNeed: 'GSB sales representatives travel frequently and submit expense reports for reimbursement. The company needs a web application allowing employees to create and track expense reports, and administrators to review, validate, or reject them. The system must handle different expense categories, apply business rules for validation, and provide role-based access.',
    approach: [
      'Analyzed the BTS SIO GSB specification to identify all entities: users, expense reports, expense lines, categories, and validation states.',
      'Chose a decoupled architecture with separate frontend (Angular) and backend (Node.js/Express) repositories for clean separation of concerns.',
      'Designed the MongoDB schema to leverage document-based storage for flexible expense report structures.',
      'Implemented JWT-based authentication with role differentiation (employee vs. administrator).',
      'Deployed to AWS for cloud hosting, demonstrating infrastructure management skills.',
    ],
    techChoices: [
      { name: 'Angular', icon: 'fa-brands fa-angular', iconColor: '#DD0031', justification: 'Strong typing with TypeScript, reactive forms ideal for expense report creation and validation workflows.' },
      { name: 'Node.js / Express', icon: 'fa-brands fa-node-js', iconColor: '#339933', justification: 'Lightweight REST API framework. JavaScript ecosystem allows shared types between frontend and backend.' },
      { name: 'MongoDB', icon: 'fa-solid fa-leaf', iconColor: '#47A248', justification: 'Document model suits the varied structure of expense reports. Flexible schema for different expense categories.' },
      { name: 'AWS', icon: 'fa-brands fa-aws', iconColor: '#FF9900', justification: 'Cloud deployment demonstrating infrastructure management. EC2 for hosting, demonstrates DevOps skills.' },
    ],
    architecture: 'Decoupled client-server: Angular SPA ↔ Node.js/Express REST API ↔ MongoDB. JWT authentication. Deployed on AWS EC2. Two separate Git repositories for frontend and backend.',
    achievements: [
      '• Full-stack development with modern decoupled architecture',
      '• Angular frontend with reactive forms and responsive design',
      '• Node.js/Express backend with MongoDB integration',
      '• JWT authentication with role-based access control',
      '• AWS deployment and cloud infrastructure management'
    ],
    results: [
      'Fully functional expense management system meeting all BTS SIO GSB requirements.',
      'Clean separation of concerns with independent frontend and backend repositories.',
      'Demonstrates full-stack proficiency across the entire development lifecycle.',
    ],
    competencies: [
      { bloc: 'Bloc 1 — Support and provisioning of IT services', color: '#0891B2', skills: ['Responding to IT service requests', 'Assisting with the development of a digital presence'] },
      { bloc: 'Bloc 3 — Software solutions and business applications', color: '#059669', skills: ['Managing IT project data', 'Developing business solution components', 'Designing and prototyping a software solution', 'Developing a secure business solution'] },
    ],
    technologies: [
      "<i class='fa-brands fa-angular'></i> Angular&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-brands fa-node-js'></i> Node.js&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-leaf'></i> MongoDB",
      "<i class='fa-brands fa-aws'></i> AWS"
    ],
    repository: [
      "<a href='https://github.com/jalmeida17/bts-gsbfrontend-angular' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/bts-gsbfrontend-angular</a>",
      "<a href='https://github.com/jalmeida17/bts-gsbbackend' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/bts-gsbbackend</a>"
    ],
    images: [],
  },
  {
    id: 'gsb-winform',
    title: 'GSB Winform',
    year: '2025',
    shortDescription: "Medical prescription management system - <i class='fa-solid fa-code'></i> <i class='fa-solid fa-hashtag'></i> <i class='fa-solid fa-database'></i> <i class='fa-brands fa-docker'></i>",
    fullDescription: [
      'A Windows Forms desktop application for managing medical prescriptions,',
      'patient records, and pharmaceutical databases. Built as part of the BTS SIO',
      'GSB exam scenario, demonstrating database design, CRUD operations, and',
      'enterprise application architecture with role-based access control.'
    ],
    context: {
      organization: 'GSB (Galaxy Swiss Bourdin) — Fictional',
      organizationDesc: 'Standard BTS SIO exam scenario. GSB doctors prescribe medications to patients. The system manages prescriptions, patient records, and the pharmaceutical catalog.',
      role: 'Solo Developer (BTS SIO exam project)',
      teamSize: 'Solo',
      duration: 'Nov 2024 - Jan 2025',
    },
    businessNeed: 'GSB doctors need a desktop application to manage medical prescriptions efficiently. The system must handle patient records, a pharmaceutical database, prescription creation with dosage management, and secure authentication. PDF export of prescriptions is required for printing and archival.',
    approach: [
      'Analyzed the BTS SIO GSB Winform specification to model the relational database: patients, doctors, medications, prescriptions, and prescription lines.',
      'Designed the MySQL database schema with referential integrity and proper normalization.',
      'Implemented SHA2-256 password hashing for secure authentication rather than storing plaintext.',
      'Used iText7 library for professional PDF generation of prescriptions.',
      'Containerized the MySQL database with Docker for portable, reproducible development environments.',
    ],
    techChoices: [
      { name: '.NET 8.0 / C#', icon: 'fa-solid fa-code', iconColor: '#512BD4', justification: 'Windows Forms for desktop UI. Strong typing and mature ecosystem for enterprise desktop applications.' },
      { name: 'MySQL', icon: 'fa-solid fa-database', iconColor: '#4479A1', justification: 'Relational database for structured medical data. Referential integrity critical for prescription management.' },
      { name: 'Docker', icon: 'fa-brands fa-docker', iconColor: '#2496ED', justification: 'Containerized MySQL for consistent development setup. Easy to share and reproduce the database environment.' },
      { name: 'iText7', icon: 'fa-solid fa-file-pdf', iconColor: '#DC2626', justification: 'Professional-grade PDF generation library for prescription export. Precise layout control for medical documents.' },
    ],
    architecture: 'Two-tier desktop architecture: WinForms UI ↔ MySQL database. Business logic in the application layer with repository pattern for data access. Docker-containerized MySQL instance.',
    achievements: [
      '• Secure authentication with SHA2-256 encryption',
      '• Professional PDF prescription export with iText7',
      '• Docker containerization for database services',
      '• Comprehensive patient and medicine management',
      '• Role-based access control (doctor vs. admin)'
    ],
    results: [
      'Complete desktop application meeting all BTS SIO GSB Winform requirements.',
      'Secure authentication going beyond basic requirements with proper password hashing.',
      'Professional PDF output suitable for real medical document standards.',
    ],
    competencies: [
      { bloc: 'Bloc 1 — Support and provisioning of IT services', color: '#0891B2', skills: ['Responding to IT service requests'] },
      { bloc: 'Bloc 2 — IT infrastructure solutions', color: '#7C3AED', skills: ['Deploying containerized services (Docker)'] },
      { bloc: 'Bloc 3 — Software solutions and business applications', color: '#059669', skills: ['Managing IT project data', 'Developing business solution components', 'Developing a secure business solution'] },
    ],
    technologies: [
      "<i class='fa-solid fa-code'></i> .NET 8.0&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-hashtag'></i> C#&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-database'></i> MySQL",
      "<i class='fa-brands fa-docker'></i> Docker&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-file-pdf'></i> PDF Generation"
    ],
    repository: [
      "<a href='https://github.com/jalmeida17/bts-gsb-winform' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/bts-gsb-winform</a>"
    ],
    images: [],
  },
  {
    id: 'raw-fitness',
    title: 'RAW - Fitness Tracker',
    year: '2026',
    shortDescription: "Bodybuilding workouts & macros tracking with social features - <i class='fa-brands fa-react'></i> <i class='fa-solid fa-database'></i> <i class='fa-solid fa-cloud'></i>",
    fullDescription: [
      'A comprehensive full-stack fitness application that combines workout tracking,',
      'macro nutrition monitoring, and social networking features. RAW enables users to',
      'log daily workouts, track nutritional macros, monitor progression over time, and',
      'connect with friends to share fitness journeys and achievements.'
    ],
    context: {
      organization: 'Personal Project',
      organizationDesc: 'Self-initiated project to solve a personal need for a unified fitness tracking platform combining workout logging, nutrition tracking, and social features.',
      role: 'Solo Full Stack Developer',
      teamSize: 'Solo',
      duration: 'Mar 2025 - Present',
    },
    businessNeed: 'Existing fitness apps either focus on workouts OR nutrition, rarely both in an integrated way. I wanted a single platform to log workouts with progression tracking, monitor daily macros (protein, carbs, fats), calculate rep maxes, and share progress with friends — all in a clean, modern interface.',
    approach: [
      'Designed the data model around the core entities: users, workouts, exercises, sets, meals, and social connections.',
      'Chose Next.js for its SSR capabilities and file-based routing, combined with Supabase as a backend-as-a-service for rapid development.',
      'Implemented real-time features using Supabase\'s built-in realtime subscriptions for social feed updates.',
      'Deployed to Vercel for seamless CI/CD with automatic preview deployments on every push.',
      'Iterative development: started with workout logging, then added nutrition, then social features.',
    ],
    techChoices: [
      { name: 'Next.js', icon: 'fa-brands fa-react', iconColor: '#000000', justification: 'React framework with SSR, file-based routing, and API routes. Ideal for a full-stack app with good SEO.' },
      { name: 'Supabase', icon: 'fa-solid fa-database', iconColor: '#3ECF8E', justification: 'PostgreSQL-based BaaS with auth, realtime, and storage. Rapid development without building a custom backend.' },
      { name: 'Vercel', icon: 'fa-solid fa-cloud', iconColor: '#000000', justification: 'Native Next.js hosting with automatic deployments, preview URLs, and edge functions.' },
    ],
    architecture: 'Serverless architecture: Next.js (Vercel) ↔ Supabase (PostgreSQL + Auth + Realtime + Storage). API routes in Next.js for server-side logic. Supabase handles authentication, database, and real-time subscriptions.',
    achievements: [
      '• Integrated workout logging with progression analytics',
      '• Real-time macro nutrition tracking and calculations',
      '• Rep max calculator and strength progression metrics',
      '• Social feed featuring friend activity and achievements',
    ],
    results: [
      'Live and functional at stayraw.fr, used personally and by friends.',
      'Demonstrates ability to design, build, and deploy a complete SaaS-style application independently.',
      'Showcases modern web development practices: serverless, BaaS, CI/CD, and real-time features.',
    ],
    competencies: [
      { bloc: 'Bloc 1 — Support and provisioning of IT services', color: '#0891B2', skills: ['Assisting with the development of a digital presence'] },
      { bloc: 'Bloc 3 — Software solutions and business applications', color: '#059669', skills: ['Managing IT project data', 'Developing business solution components', 'Designing and prototyping a software solution', 'Developing a secure business solution'] },
    ],
    technologies: [
      "<i class='fa-brands fa-react'></i> Next.js&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-database'></i> Supabase&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-solid fa-cloud'></i> Vercel"
    ],
    repository: [
      "<a href='https://www.stayraw.fr' target='_blank' style='color: #298FDD;'>www.stayraw.fr</a>"
    ],
    images: [],
  },
  {
    id: 'webshell-portfolio',
    title: 'WebShell Portfolio',
    year: '2025',
    shortDescription: "Interactive Ubuntu terminal portfolio - <i class='fa-brands fa-js'></i> <i class='fa-brands fa-html5'></i> <i class='fa-brands fa-css3-alt'></i> <i class='fa-solid fa-fire'></i>",
    fullDescription: [
      "An Ubuntu-themed terminal portfolio website you're viewing right now!",
      'Features an interactive command-line interface with multiple application',
      'windows, tech watch integration, and a fully responsive Ubuntu desktop',
      'simulation. Demonstrates advanced CSS, TypeScript, and creative web design.'
    ],
    context: {
      organization: 'Personal Project',
      organizationDesc: 'Creative portfolio project to showcase technical skills through an interactive Ubuntu desktop simulation rather than a traditional portfolio website.',
      role: 'Solo Developer',
      teamSize: 'Solo',
      duration: 'Nov 2025 - Present',
    },
    businessNeed: 'Standard portfolio websites are generic and forgettable. I wanted a portfolio that itself demonstrates technical ability — a pixel-perfect Ubuntu desktop simulation with working terminal, draggable windows, a music player, and app ecosystem. The portfolio IS the project.',
    approach: [
      'Chose pure TypeScript without frameworks to demonstrate DOM manipulation skills and keep bundle size minimal.',
      'Built a complete window management system (drag, resize, minimize, maximize, close, z-index layering).',
      'Implemented a terminal emulator with command parsing, history, tab completion, and easter eggs.',
      'Created GNOME-styled app windows for a cohesive Ubuntu desktop experience.',
    ],
    techChoices: [
      { name: 'TypeScript', icon: 'fa-brands fa-js', iconColor: '#3178C6', justification: 'Strong typing without framework overhead. Pure DOM manipulation showcases core web skills.' },
      { name: 'Vite', icon: 'fa-solid fa-fire', iconColor: '#646CFF', justification: 'Fast HMR development server and optimized production builds. Minimal config, maximum speed.' },
      { name: 'HTML5 / CSS3', icon: 'fa-brands fa-html5', iconColor: '#E34F26', justification: 'Pixel-perfect Ubuntu theming requires advanced CSS: custom scrollbars, backdrop-filter, grid layouts.' },
    ],
    architecture: 'Single-page application: pure TypeScript with Vite bundler. No framework — all DOM manipulation is vanilla. Deployed as static files on Vercel.',
    achievements: [
      '• Pixel-perfect Ubuntu desktop simulation',
      '• Interactive multi-window terminal system',
      '• GNOME-styled app ecosystem (Tech Watch, Resume, Skills, Projects)',
      '• Custom command-line interface with easter eggs'
    ],
    results: [
      'A unique portfolio that stands out from template-based alternatives.',
      'Demonstrates deep understanding of browser APIs, CSS, and TypeScript.',
      'Positive reception from peers and recruiters for its creativity and attention to detail.',
    ],
    competencies: [
      { bloc: 'Bloc 1 — Support and provisioning of IT services', color: '#0891B2', skills: ['Assisting with the development of a digital presence'] },
      { bloc: 'Bloc 3 — Software solutions and business applications', color: '#059669', skills: ['Developing business solution components', 'Designing and prototyping a software solution'] },
    ],
    technologies: [
      "<i class='fa-brands fa-js'></i> TypeScript&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-brands fa-html5'></i> HTML5&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa-brands fa-css3-alt'></i> CSS3",
      "<i class='fa-solid fa-fire'></i> Vite"
    ],
    repository: [
      "<a href='https://github.com/jalmeida17/webshell-portfolio' target='_blank' style='color: #298FDD;'>github.com/jalmeida17/webshell-portfolio</a>"
    ],
    images: [],
  },
  {
    id: 'threejs-portfolio',
    title: 'Three.js Portfolio',
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
    ],
    images: [],
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
