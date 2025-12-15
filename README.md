# Sales Force Nexus

A comprehensive Sales Force Management System built with React, Vite, and modern web technologies. This application helps sales teams manage leads, customers, and track performance through an intuitive dashboard interface.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication**: Separate login systems for Sales, Admin, and Super Admin users
- **Lead Management**: Create, update, and track sales leads with detailed information
- **Customer Management**: Comprehensive customer database with contact information
- **ML-Powered Scoring**: Automatic lead scoring using machine learning models
- **Follow-up Tracking**: Record and manage customer interactions and follow-ups

### User Roles & Permissions
- **Sales Users**: Access to personal dashboard, lead management, and customer details
- **Admin Users**: Full access to customer and lead management, user administration
- **Super Admin**: System-wide administration and configuration

### Advanced Features
- **Real-time Lead Scoring**: ML model integration for intelligent lead prioritization
- **Contact Integration**: Direct calling functionality for customer outreach
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Built with Tailwind CSS and Radix UI components

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Date-fns** - Modern date utility library

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Deployment
- **Vercel** - Cloud platform for frontend deployment
- **GitHub** - Version control and CI/CD

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Backend API** - The application requires a backend API server

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DanuRamdhani/sales-force-nexus.git
cd sales-force-nexus
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Development environment variables
VITE_API_BASE_URL=http://localhost:8000

# Production environment variables (for deployment)
# VITE_API_BASE_URL=https://your-production-api-domain.com
```

**Note**: Replace `http://localhost:8000` with your actual backend API URL.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### 6. Preview Production Build

```bash
npm run preview
```

## 🌐 Deployment to Vercel

### Option 1: GitHub Integration (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Vercel will auto-detect your Vite configuration

3. **Configure Environment Variables**:
   - In Vercel dashboard, go to your project settings
   - Add environment variable: `VITE_API_BASE_URL`
   - Set value to your production API URL

4. **Deploy**: Vercel will automatically deploy your application

### Option 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add VITE_API_BASE_URL
   ```

## 📁 Project Structure

```
sales-force-nexus/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Radix UI components
│   │   └── Require*.jsx   # Route protection components
│   ├── lib/
│   │   └── auth.js        # Authentication utilities
│   ├── pages/             # Page components
│   │   ├── *Page.jsx      # Main application pages
│   │   └── LoginPage.jsx  # Authentication page
│   ├── styles/            # CSS styles
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── .env                   # Environment variables (local)
├── .env.example           # Environment variables template
├── vercel.json            # Vercel deployment configuration
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🔧 Configuration Files

### Vite Configuration (`vite.config.js`)
- React plugin setup
- Path aliases (`@` for `src/`)
- Development proxy configuration

### Vercel Configuration (`vercel.json`)
- Build commands and output directory
- SPA routing rewrites
- Framework detection

### Tailwind Configuration (`tailwind.config.js`)
- Custom color schemes
- Component configurations
- Responsive breakpoints

## 🔗 API Integration

The application expects a REST API backend with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login

### Admin Endpoints
- `GET /api/admin/customers` - List customers
- `POST /api/admin/customers` - Create customer
- `PUT /api/admin/customers/:id` - Update customer
- `DELETE /api/admin/customers/:id` - Delete customer

### Sales Endpoints
- `GET /api/sales/leads/:id` - Get lead details
- `POST /api/sales/leads/:id/followups` - Add follow-up
- `PATCH /api/sales/leads/:id/status` - Update lead status

### ML Integration
- `POST /api/admin/leads/:id/predict` - Generate ML score

## 🎨 UI/UX Features

### Design System
- **Glass Morphism**: Modern glass-like UI elements
- **Gradient Backgrounds**: Beautiful color transitions
- **Responsive Grid**: Mobile-first responsive design
- **Dark/Light Themes**: Theme support ready

### Components
- **Form Components**: Input, Select, Textarea with validation
- **Data Display**: Cards, Tables, Charts
- **Feedback**: Toast notifications, Loading states
- **Navigation**: Breadcrumbs, Sidebar navigation

## 🧪 Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Keep components small and focused

### File Naming
- Components: `PascalCase` (e.g., `CustomerCard.jsx`)
- Pages: `PascalCase` + `Page` (e.g., `DashboardPage.jsx`)
- Utilities: `camelCase` (e.g., `auth.js`)

### Git Workflow
1. Create feature branches from `main`
2. Use descriptive commit messages
3. Create pull requests for code review
4. Merge to `main` after approval

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Danu Ramdhani** - *Initial work* - [DanuRamdhani](https://github.com/DanuRamdhani)

## 🙏 Acknowledgments

- React and Vite teams for excellent documentation
- Tailwind CSS and Radix UI for beautiful components
- Vercel for seamless deployment platform
- All contributors and the open-source community

---

**Happy coding! 🎉**
