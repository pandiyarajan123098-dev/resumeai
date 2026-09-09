// ResumeX AI Lightweight RAG Role Knowledge Base
// Contains domain expectations, required skills, ATS keywords, and project signals for target roles

export const ROLE_KNOWLEDGE_BASE = {
  'Frontend Developer': {
    requiredSkills: [
      'JavaScript',
      'TypeScript',
      'React',
      'HTML5/CSS3',
      'Tailwind CSS / SASS',
      'State Management (Redux/Zustand)',
    ],
    importantKeywords: [
      'Responsive Web Design',
      'REST API Integration',
      'Core Web Vitals & Performance Optimization',
      'Component Architecture',
      'Unit Testing (Jest/React Testing Library)',
      'Cross-Browser Compatibility',
      'Git Version Control',
    ],
    commonResponsibilities: [
      'Build scalable, responsive web user interfaces.',
      'Optimize web application performance and API bundle size.',
      'Collaborate with UI/UX designers and backend engineers.',
    ],
    recommendedProjectSignals: [
      'Quantifiable Web Vitals improvement (e.g. reduced LCP by 40%).',
      'Production React / Next.js web application links.',
      'Design system component library creation.',
    ],
    expectedTools: ['React', 'Next.js', 'Vite', 'TypeScript', 'Figma', 'Git', 'npm/yarn'],
  },

  'Backend Developer': {
    requiredSkills: [
      'Node.js / Express',
      'Python (Django/FastAPI)',
      'SQL (PostgreSQL/MySQL)',
      'NoSQL (MongoDB/Redis)',
      'RESTful & GraphQL API Design',
      'Microservices Architecture',
    ],
    importantKeywords: [
      'Database Schema Optimization & Indexing',
      'Authentication & Authorization (JWT/OAuth)',
      'Docker Containerization & Kubernetes',
      'CI/CD Deployment Pipelines',
      'Asynchronous Queue Processing (RabbitMQ/Celery)',
      'API Rate Limiting & Security',
    ],
    commonResponsibilities: [
      'Design robust server-side architecture and data models.',
      'Build secure RESTful and GraphQL APIs for client applications.',
      'Optimize database queries and system latency under high traffic.',
    ],
    recommendedProjectSignals: [
      'High-concurrency benchmark metrics (e.g., 10k RPS handled).',
      'Database query speed optimization numbers.',
      'Automated CI/CD pipeline implementation.',
    ],
    expectedTools: ['Node.js', 'PostgreSQL', 'Docker', 'Redis', 'AWS/GCP', 'Postman'],
  },

  'Full Stack Developer': {
    requiredSkills: [
      'JavaScript / TypeScript',
      'React / Next.js',
      'Node.js / Express',
      'Relational & Document Databases',
      'API Integration & Architecture',
      'Cloud Deployment (AWS/Vercel)',
    ],
    importantKeywords: [
      'End-to-End Application Architecture',
      'Server-Side Rendering (SSR) & Static Generation',
      'REST API & GraphQL Interfaces',
      'Full Stack Security & Validation',
      'Git Branching & Release Management',
    ],
    commonResponsibilities: [
      'Develop complete features across front-end, back-end, and database layers.',
      'Maintain database integrity and seamless UI integration.',
    ],
    recommendedProjectSignals: [
      'Deploys live full-stack web applications with authentication.',
      'Implements secure payments or third-party API webhooks.',
    ],
    expectedTools: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'Vercel'],
  },

  'UI/UX Designer': {
    requiredSkills: [
      'Figma & Auto-Layout',
      'User Research & Usability Testing',
      'Wireframing & Interactive Prototyping',
      'Design Systems & Component Specs',
      'Information Architecture & User Journeys',
    ],
    importantKeywords: [
      'User-Centered Design (UCD)',
      'Accessibility (WCAG 2.1 Guidelines)',
      'Visual Design & Design Tokens',
      'Heuristic Evaluation',
      'A/B Testing & Behavioral Metrics',
    ],
    commonResponsibilities: [
      'Create high-fidelity interactive wireframes and user flows.',
      'Maintain centralized scalable design systems in Figma.',
      'Conduct usability interviews and translate insights into design revisions.',
    ],
    recommendedProjectSignals: [
      'Case studies detailing research methodology and conversion impact.',
      'Figma design system libraries with interactive variants.',
    ],
    expectedTools: ['Figma', 'Miro', 'Protopie', 'UsabilityHub', 'Lottie'],
  },

  'Data Analyst': {
    requiredSkills: [
      'SQL (Complex Joins & CTEs)',
      'Python / R (Pandas/NumPy)',
      'Data Visualization (Tableau/PowerBI)',
      'Statistical Analysis & Hypothesis Testing',
      'Excel (Pivot Tables & VBA/Macros)',
    ],
    importantKeywords: [
      'Exploratory Data Analysis (EDA)',
      'Business Intelligence (BI) Dashboards',
      'Data Cleansing & Transformation',
      'Key Performance Indicator (KPI) Tracking',
      'A/B Experimentation & Analytics',
    ],
    commonResponsibilities: [
      'Query large data sets to answer executive business questions.',
      'Build automated real-time KPI dashboards for leadership.',
    ],
    recommendedProjectSignals: [
      'Data stories explaining revenue or retention uplift.',
      'Interactive Tableau or PowerBI dashboard links.',
    ],
    expectedTools: ['SQL', 'Python', 'Tableau', 'Power BI', 'Jupyter', 'BigQuery'],
  },

  'Software Engineer': {
    requiredSkills: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (OOP)',
      'System Architecture & Design Patterns',
      'Git Version Control & Code Review',
      'Unit & Integration Testing',
    ],
    importantKeywords: [
      'Clean Code Principles & Refactoring',
      'Scalable System Engineering',
      'CI/CD Automated Testing',
      'Agile / Scrum Development Methodology',
    ],
    commonResponsibilities: [
      'Write clean, well-tested production code.',
      'Participate in architecture reviews and automated CI testing.',
    ],
    recommendedProjectSignals: [
      'Open-source contributions or technical documentation.',
      'High automated test coverage (e.g. > 85% coverage).',
    ],
    expectedTools: ['Git', 'Docker', 'Linux/Unix Shell', 'Jest', 'CI/CD Pipelines'],
  },
};
