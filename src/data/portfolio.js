export const profile = {
  name: 'Anirban Mondal',
  role: 'Lead Developer & System Architect',
  location: 'Kolkata, India',
  email: 'anirbanmondal1405@gmail.com',
  phone: '+91 98745 32400',
  github: 'https://github.com/SpectraAnirban',
  githubLabel: 'github.com/SpectraAnirban',
  resume: 'resume/Anirban_Mondal_Lead_Developer_Resume.pdf',
  intro:
    'I design and build production platforms end to end — from database schema and service boundaries to the React interface your users touch. ERP, CRM, subscription commerce and customised e-commerce, shipped and running.',
  rotating: ['System Architect', 'Full-Stack Engineer', 'Backend Specialist', 'Team Lead'],
};

export const stats = [
  { value: 4, suffix: '+', label: 'Years shipping production software' },
  { value: 7, suffix: '', label: 'Platforms designed & delivered' },
  { value: 130, suffix: '+', label: 'Data models in a single ERP' },
  { value: 10, suffix: '', label: 'Microservices behind one gateway' },
];

const img = (name) => `works/${name}.webp`;
const thumb = (name) => `works/${name}-sm.webp`;

export const projects = [
  {
    slug: 'blackbox-erp',
    name: 'Blackbox ERP',
    tagline: 'An all-in-one operating system for a creative agency.',
    role: 'System Architect & Lead Developer',
    category: 'Enterprise',
    year: '2024 — Present',
    accent: '#7c5cff',
    cover: null,
    icon: 'erp',
    stack: ['Node.js', 'Express.js', 'React.js', 'MySQL', 'Sequelize', 'Socket.IO', 'Puppeteer', 'AWS S3', 'node-cron'],
    summary:
      'I designed the complete architecture, database schema and API layer of Blackbox — the ERP that runs HR, payroll, projects, clients and accounts across dedicated Admin, HR, Employee and Client portals, all governed by role-based access control.',
    metrics: [
      { value: '130+', label: 'Sequelize models' },
      { value: '40+', label: 'REST route modules' },
      { value: '11', label: 'Scheduled jobs' },
      { value: '4', label: 'Role-based portals' },
    ],
    features: [
      { title: 'HR & Payroll', text: 'Attendance and time tracking, leave types, balances and approvals, overtime, holidays, monthly salary generation with PDF payslips, expense deductions and resignation workflows.' },
      { title: 'Project Management', text: 'Kanban boards with cards, checklists, dependencies and attachments; Gantt charts, a team capacity planner, approval queue and an automated deadline-scheduling engine.' },
      { title: 'Performance Reviews', text: 'Configurable review templates with phases and metrics, scored reviews with full history, action plans and automated monthly review cycles.' },
      { title: 'Org Hierarchy', text: 'Organisation tree with department-head permissions, interim project ownership and audit-friendly reporting lines.' },
      { title: 'Client Onboarding', text: 'Registration links and a dynamic form builder whose submissions auto-generate tasks on the right boards.' },
      { title: 'Accounts', text: 'Tax invoices with recurring billing, service catalogue, expense tracking and template-based letters with digital signatures.' },
      { title: 'Real-time Collaboration', text: 'Socket.IO chat with attachments and read status, live board updates, meeting minutes, ticketing helpdesk and brand book.' },
      { title: 'Automation', text: '11 node-cron jobs for deadlines, leave processing, recurring invoices and birthday / anniversary greetings, with email and WhatsApp notifications.' },
    ],
    architecture: {
      title: 'Modular monolith, real-time edge',
      nodes: ['Express API', 'React Portals', 'RBAC Middleware', 'Sequelize / MySQL', 'Socket.IO', 'Cron Scheduler', 'S3 + PDFs', 'Email / WhatsApp'],
    },
    gallery: [],
  },
  {
    slug: 'graphe-weddings',
    name: 'Graphe Weddings',
    subtitle: 'Wedding Stationery Platform',
    tagline: 'Customisable wedding stationery, on a 10-service microservices backbone.',
    role: 'System Architect & Lead Developer',
    category: 'E-commerce',
    year: '2025 — Present',
    accent: '#c19a6b',
    cover: img('GrapheWeddings'),
    thumb: thumb('GrapheWeddings'),
    stack: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'Sequelize', 'RabbitMQ', 'Docker', 'Coolify', 'Cashfree', 'AWS S3'],
    summary:
      'A premium storefront and admin console for customised wedding stationery. I architected an API Gateway with ten dedicated services talking over RabbitMQ Pub/Sub, containerised and deployed with Docker Compose and Coolify.',
    metrics: [
      { value: '10', label: 'Microservices' },
      { value: '30', label: 'Admin modules' },
      { value: '0', label: 'JWTs — opaque sessions only' },
      { value: '1', label: 'Gateway, route-level RBAC' },
    ],
    features: [
      { title: 'Microservices Architecture', text: 'API Gateway in front of auth, user, product, form, cart, order, review, notification and email services, communicating asynchronously via RabbitMQ Pub/Sub.' },
      { title: 'Hardened Sessions', text: 'Opaque server-side sessions in httpOnly cookies with SHA-256 hashed keys, device binding, idle and absolute expiry, per-role device limits and remote sign-out.' },
      { title: 'Gateway-enforced RBAC', text: 'The gateway derives the required page permission from the route itself — unmapped admin routes are refused. Plus CSP and rate limiting.' },
      { title: 'Product Customisation', text: 'Reusable option templates with per-product overrides, dynamic form builder, collections, tax classes and Excel / ZIP bulk upload with row-level validation.' },
      { title: 'Payments & Invoicing', text: 'Cashfree checkout with verified webhooks, tax invoices, credit notes and OTP-verified refunds.' },
      { title: 'Disputes & Support', text: 'Order disputes with threaded support chat, attachments, priorities and resolution states.' },
      { title: 'Questionnaires', text: 'Post-order questionnaires with field-level change history, autosave sessions and PDF export.' },
      { title: 'Marketing Engine', text: 'Consent-based newsletters with scheduling, suppression lists and one-click unsubscribe; targeted promotional popups; maintenance mode.' },
    ],
    architecture: {
      title: 'API Gateway + event-driven services',
      nodes: ['API Gateway', 'Auth', 'User', 'Product', 'Form', 'Cart', 'Order', 'Review', 'Notification', 'Email'],
    },
    gallery: [
      { src: img('GrapheWeddings'), caption: 'Storefront — hero and search' },
      { src: img('GrapheWeddings2'), caption: 'Category mega-menu with featured collections' },
      { src: img('GrapheWeddings3'), caption: 'OTP-verified contact flow' },
      { src: img('GrapheWeddings4'), caption: 'Account — newsletter consent and signed-in device management' },
      { src: img('GrapheWeddings5'), caption: 'Order dispute centre with live support chat' },
    ],
  },
  {
    slug: 'shaadi-material',
    name: 'Shaadi Material',
    tagline: 'A credit-based marketplace for wedding design assets.',
    role: 'Lead Developer',
    category: 'Subscription Commerce',
    year: '2025 — Present',
    accent: '#f472b6',
    cover: img('ShaadiMaterial'),
    thumb: thumb('ShaadiMaterial'),
    stack: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'Sequelize', 'Razorpay', 'AWS S3', 'Socket.IO', 'Sharp'],
    summary:
      'A digital asset marketplace for backdrops, caricatures, invites, logos and mythology art. Users subscribe, earn and spend credits, and download premium source files — protected by watermarked previews and pre-signed S3 links.',
    metrics: [
      { value: '4', label: 'Subscription tiers' },
      { value: '6', label: 'Design categories' },
      { value: 'Daily', label: 'Reward spins' },
      { value: 'PSD', label: 'Premium source files' },
    ],
    features: [
      { title: 'Credit Economy', text: 'Every asset is priced in coins; monthly credit allowances per plan, redemption history and live balance in the header.' },
      { title: 'Tiered Subscriptions', text: 'Starter, Premium, Premium+ and Pro plans with monthly / annual billing through Razorpay.' },
      { title: 'Protected Downloads', text: 'Watermarked previews generated server-side and premium PSD downloads served through AWS S3 pre-signed URLs.' },
      { title: 'Lucky Wheel', text: 'A daily subscriber reward spin with tracked wins, next-spin countdown and win history.' },
      { title: 'Discovery', text: 'Category mega-menus, category-scoped search, bundles, SKUs and rich product detail pages.' },
      { title: 'Customer Dashboard', text: 'Profile, subscriptions, history, billing, preferences and support tickets in one place.' },
      { title: 'Bulk Catalogue Publishing', text: 'Admin pipeline to publish large catalogues in bulk with per-item processing reports.' },
    ],
    gallery: [
      { src: img('ShaadiMaterial'), caption: 'Homepage hero' },
      { src: img('ShaadiMaterial2'), caption: 'Trending assets and category browsing' },
      { src: img('ShaadiMaterial3'), caption: 'Product page — coin pricing and premium PSD' },
      { src: img('ShaadiMaterial4'), caption: 'Four-tier subscription pricing' },
      { src: img('ShaadiMaterial5'), caption: 'Daily lucky-wheel reward in the customer dashboard' },
    ],
  },
  {
    slug: 'shalimar-hosiery',
    name: 'Shalimar Hosiery',
    subtitle: 'Manufacturing CRM',
    tagline: 'From purchase order to dispatch — every garment, every stage.',
    role: 'Full-Stack Developer',
    category: 'Enterprise',
    year: '2023 — Present',
    accent: '#ef4f2b',
    cover: img('Shalimar'),
    thumb: thumb('Shalimar'),
    stack: ['Node.js', 'Express.js', 'React.js', 'MySQL', 'Sequelize', 'JWT', 'Socket.IO', 'Puppeteer', 'AWS S3'],
    summary:
      'A three-portal platform — public website, admin panel and vendor panel — for an ISO-certified apparel manufacturer, tracking purchase orders through every production stage in real time.',
    metrics: [
      { value: '3', label: 'Portals' },
      { value: '13', label: 'Production stages' },
      { value: 'Live', label: 'Socket.IO status' },
      { value: 'RBAC', label: 'Page × action permission matrix' },
    ],
    features: [
      { title: 'Production Pipeline', text: 'Orders flow through fabric, cutting, embroidery, screen printing, sublimation, stitching L1/L2, finishing, press & packing, billing, hold and dispatch.' },
      { title: 'Purchase Orders', text: 'PO creation with sizes and line items, PO history, invoicing and Puppeteer-generated PDFs stored on S3 with scheduled clean-up.' },
      { title: 'Live Dashboard', text: 'Stage counters and order, PO and vendor overviews updated in real time via Socket.IO.' },
      { title: 'Roles & Permissions', text: 'A page × add / edit / view / delete matrix per role, from Super Admin to vendor.' },
      { title: 'Vendors & Catalogue', text: 'Vendor and organisation onboarding with verification, school-wise catalogues and a fabric library.' },
      { title: 'Reporting', text: 'Internal, main, statistical and PO reports with date-range filters and Excel exports.' },
    ],
    gallery: [
      { src: img('Shalimar'), caption: 'Public website' },
      { src: img('Shalimar2'), caption: 'Admin dashboard — live production stages' },
      { src: img('Shalimar3'), caption: 'PO tracking with filters and bulk status changes' },
      { src: img('Shalimar4'), caption: 'Roles & permissions matrix' },
    ],
  },
  {
    slug: 'indothai',
    name: 'IndoThai',
    subtitle: 'Airport Ground Handling',
    tagline: 'A corporate presence for a ground-handling operator.',
    role: 'Designer, Developer & Backend Architect',
    category: 'Corporate Web',
    year: '2025',
    accent: '#a855f7',
    cover: img('Indothai'),
    thumb: thumb('Indothai'),
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express.js', 'Nodemailer / SMTP'],
    summary:
      'I designed and developed the static website for IndoThai, an airport ground-handling company, and architected the backend that delivers its enquiries over SMTP.',
    metrics: [
      { value: 'Static', label: 'Fast, host-anywhere frontend' },
      { value: 'SMTP', label: 'Enquiry delivery' },
    ],
    features: [
      { title: 'Design & Build', text: 'Bold brand-led design with a 3D-rendered hero and responsive layouts across Home, About, Airports, Careers, Media and Contact.' },
      { title: 'Airport Pages', text: 'Per-airport pages with operations handled, operational year, IATA / ICAO codes, duty contact and coordinates.' },
      { title: 'SMTP Backend', text: 'A lightweight Node.js service that validates and delivers website enquiries by email.' },
    ],
    gallery: [
      { src: img('Indothai'), caption: 'Homepage hero' },
      { src: img('Indothai5'), caption: 'Airport detail page — Kolkata' },
    ],
  },
  {
    slug: 'midnight-loom',
    name: 'Midnight Loom',
    tagline: 'Subscription and coin-based digital commerce.',
    role: 'Full-Stack Developer',
    category: 'Subscription Commerce',
    year: '2024',
    accent: '#38bdf8',
    cover: null,
    icon: 'loom',
    stack: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'Sequelize', 'Razorpay', 'Socket.IO'],
    summary:
      'A subscription and coin-based digital commerce platform with tiered plans, secure product downloads and a complete admin console.',
    metrics: [
      { value: 'Tiered', label: 'Subscription plans' },
      { value: 'Razorpay', label: 'Payments & subscriptions' },
    ],
    features: [
      { title: 'Commerce', text: 'Tiered plans, secure product downloads, search and filters, related products, reviews and cart / order flows.' },
      { title: 'Payments', text: 'Razorpay payment and subscription workflows, cancellation / refund eligibility and invoice status handling.' },
      { title: 'Experience', text: 'Authentication guards, real-time updates and frontend request caching.' },
      { title: 'Admin Controls', text: 'Catalogue, plan and order administration.' },
    ],
    gallery: [],
  },
];

export const capabilities = [
  { id: 'arch', title: 'System Architecture', icon: 'arch', text: 'Service boundaries, API gateways, event-driven messaging and data models designed to survive growth.', items: ['Microservices', 'API Gateway', 'RabbitMQ Pub/Sub', 'Event-Driven Design', 'Modular Monoliths', 'System Design'] },
  { id: 'backend', title: 'Backend Engineering', icon: 'server', text: 'Secure, well-structured REST APIs with real-time channels, scheduled jobs and document generation.', items: ['Node.js', 'Express.js', 'REST APIs', 'Socket.IO', 'node-cron', 'Puppeteer', 'Flask'] },
  { id: 'data', title: 'Data Modelling', icon: 'db', text: 'Relational schemas with associations, transactions and migrations — 130+ models in a single system.', items: ['MySQL', 'Sequelize ORM', 'Transactions', 'Migrations', 'Query Optimisation'] },
  { id: 'frontend', title: 'Frontend', icon: 'layout', text: 'Dashboards, Kanban and Gantt views, storefronts and admin consoles in React.', items: ['React.js', 'React Router', 'Context API', 'PrimeReact', 'React Bootstrap', 'Framer Motion', 'Three.js'] },
  { id: 'security', title: 'Security', icon: 'shield', text: 'Session hardening, RBAC enforced at the gateway, CSP, rate limiting and audit trails.', items: ['Session Auth', 'JWT', 'RBAC', 'CSP / Helmet', 'Rate Limiting', 'CSRF Protection', 'bcrypt'] },
  { id: 'devops', title: 'DevOps & Delivery', icon: 'container', text: 'Containerised multi-service deployments and the team process that ships them.', items: ['Docker', 'Docker Compose', 'Coolify', 'AWS S3', 'GitHub', 'Kubernetes (basics)', 'Postman'] },
  { id: 'integrations', title: 'Integrations', icon: 'plug', text: 'Payments, email, messaging and bulk data pipelines wired in reliably.', items: ['Razorpay', 'Cashfree', 'Nodemailer / SMTP', 'WhatsApp', 'ExcelJS / XLSX', 'ZIP Bulk Import'] },
  { id: 'lead', title: 'Leadership', icon: 'team', text: 'Turning business requirements into release plans, then reviewing and unblocking until they ship.', items: ['Technical Planning', 'Task Breakdown', 'Code Review', 'Debugging', 'Integration Testing', 'Release Coordination'] },
];

export const languages = ['JavaScript (ES6+)', 'SQL', 'Python', 'Java', 'HTML5', 'CSS3'];

export const timeline = [
  {
    period: '2024 — Present',
    title: 'Lead Developer / Team Lead',
    org: 'Graphe',
    place: 'Kolkata, India',
    points: [
      'Lead planning and delivery of Blackbox ERP, Graphe Weddings, Shaadi Material, Shalimar Hosiery, Midnight Loom and IndoThai.',
      'System Architect of Blackbox ERP and the Graphe Weddings microservices platform.',
      'Containerise services with Docker Compose and deploy through Coolify and GitHub workflows.',
      'Guide the team through task breakdown, code reviews, testing and releases.',
    ],
  },
  {
    period: '2022 — 2024',
    title: 'Technical Researcher — Software Development',
    org: 'Royal Research',
    place: 'Kolkata, India',
    points: ['Built and maintained web applications with Node.js, Express.js, React.js, Python / Flask and MySQL, from schema design to deployment.'],
  },
  {
    period: '2019 — 2022',
    title: 'Career Break',
    org: 'Family responsibilities',
    place: '',
    points: ['Returned to full-time professional work in 2022.'],
  },
  {
    period: '2014 — 2018',
    title: 'B.Tech, Electrical Engineering',
    org: 'Meghnad Saha Institute of Technology',
    place: 'Kolkata, India',
    points: ['CGPA 6.95 / 10'],
  },
];
