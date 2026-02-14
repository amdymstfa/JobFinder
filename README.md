# 🎯 JobFinder - Job Search Application

![Angular](https://img.shields.io/badge/Angular-17+-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-cyan?logo=tailwindcss)
![NgRx](https://img.shields.io/badge/NgRx-17+-purple?logo=ngrx)
![License](https://img.shields.io/badge/License-Educational-green)

## 📋 Project Overview

JobFinder is a modern **Single Page Application (SPA)** built with **Angular 17+** that enables job seekers to:

- 🔍 **Search** job offers from public APIs
- ⭐ **Save** favorite job listings
- 📊 **Track** application statuses
- 👤 **Manage** personal profile

### Live Demo
🚀 [Demo Link](#) *(if deployed)*

### Screenshots
![JobFinder Home](./screenshots/home.png)
![Job Search](./screenshots/search.png)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 17+ | Frontend Framework (Standalone Components) |
| **NgRx** | 17+ | State Management (Favorites) |
| **RxJS** | 7.8+ | Reactive Programming |
| **TailwindCSS** | 3.4+ | Utility-first CSS Framework |
| **TypeScript** | 5.4+ | Type-safe JavaScript |

### Backend (Simulated)
| Technology | Version | Purpose |
|------------|---------|---------|
| **JSON Server** | 0.17+ | Fake REST API |

### External APIs
- **Adzuna Jobs API** - Job listings
- Documentation: https://job-finder-api-nine.vercel.app/

---

## 📁 Project Architecture
```
JobFinder/
├── src/
│   ├── app/
│   │   ├── core/                      # Singleton services, guards, interceptors
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts      # Route protection
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts    # Authentication logic
│   │   │   │   └── storage.service.ts # sessionStorage management
│   │   │   ├── interceptors/
│   │   │   │   └── error.interceptor.ts # HTTP error handling
│   │   │   └── models/                # TypeScript interfaces
│   │   │       ├── user.model.ts
│   │   │       ├── job.model.ts
│   │   │       ├── favorite.model.ts
│   │   │       └── application.model.ts
│   │   │
│   │   ├── shared/                    # Reusable components
│   │   │   └── components/
│   │   │       ├── navbar/            # Navigation bar
│   │   │       ├── loader/            # Loading spinner
│   │   │       └── footer/            # Footer
│   │   │
│   │   ├── features/                  # Business modules
│   │   │   ├── auth/                  # Authentication
│   │   │   │   └── components/
│   │   │   │       ├── login/
│   │   │   │       ├── register/
│   │   │   │       └── profile/
│   │   │   │
│   │   │   ├── jobs/                  # Job search
│   │   │   │   ├── components/
│   │   │   │   │   ├── job-search/
│   │   │   │   │   ├── job-list/
│   │   │   │   │   └── job-card/
│   │   │   │   └── services/
│   │   │   │       └── job.service.ts
│   │   │   │
│   │   │   ├── favorites/             # Favorites (NgRx)
│   │   │   │   ├── components/
│   │   │   │   │   └── favorites-list/
│   │   │   │   ├── services/
│   │   │   │   │   └── favorites.service.ts
│   │   │   │   └── store/             # NgRx Store
│   │   │   │       ├── favorites.actions.ts
│   │   │   │       ├── favorites.reducer.ts
│   │   │   │       ├── favorites.effects.ts
│   │   │   │       └── favorites.selectors.ts
│   │   │   │
│   │   │   └── applications/          # Application tracking
│   │   │       ├── components/
│   │   │       │   ├── applications-list/
│   │   │       │   └── application-card/
│   │   │       └── services/
│   │   │           └── applications.service.ts
│   │   │
│   │   ├── store/                     # Global NgRx
│   │   │   └── app.state.ts
│   │   │
│   │   ├── app.component.ts           # Root component
│   │   ├── app.config.ts              # App configuration
│   │   └── app.routes.ts              # Routing with lazy loading
│   │
│   ├── assets/                        # Static assets
│   ├── environments/                  # Environment configs
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   └── styles.css                     # Global Tailwind styles
│
├── db.json                            # JSON Server database
├── tailwind.config.js                 # Tailwind configuration
├── postcss.config.js                  # PostCSS configuration
├── package.json                       # Dependencies
├── angular.json                       # Angular CLI config
└── README.md                          # This file
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
```bash
node --version   # v18.x or higher
npm --version    # v9.x or higher
ng version       # Angular CLI 17.x or higher
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/JobFinder.git
cd JobFinder
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Edit `src/environments/environment.development.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  jobApiUrl: 'https://api.adzuna.com/v1/api/jobs',
  jobApiKey: 'YOUR_ADZUNA_API_KEY',      // Get from https://developer.adzuna.com/
  jobApiId: 'YOUR_ADZUNA_APP_ID'
};
```

4. **Start JSON Server** (Terminal 1)
```bash
npm run serve:json
```
JSON Server will run on: `http://localhost:3000`

5. **Start Angular Development Server** (Terminal 2)
```bash
npm start
```
Angular app will run on: `http://localhost:4200`

6. **Or run both concurrently**
```bash
npm run dev
```

---

## 🔑 Demo Credentials

Use these credentials to test the application:
```
Email: admin@jobfinder.com
Password: Admin123!
```

---

## 📚 Features Implementation

### 1. 🔐 Authentication (sessionStorage)

**Why sessionStorage?**
- ✅ **Security**: Data cleared when browser closes
- ✅ **GDPR Compliant**: Limited data lifetime
- ✅ **Shared Devices**: Prevents unauthorized access
- ❌ **Tradeoff**: User must login each session

**Implementation:**
- Fake authentication via JSON Server
- User object (without password) stored in sessionStorage
- AuthGuard protects routes (profile, favorites, applications)

### 2. 🔍 Job Search

**Features:**
- Search by keywords (job title only)
- Filter by location
- Sort by date (newest first)
- Pagination (10 results per page)
- Accessible without authentication

**API Integration:**
- Primary: Adzuna API
- Fallback: Mock data for testing

### 3. ⭐ Favorites Management (NgRx)

**State Management:**
- **Actions**: Load, Add, Remove favorites
- **Reducers**: Immutable state updates
- **Effects**: Async HTTP operations
- **Selectors**: Derived state queries

**Features:**
- No duplicate favorites
- Visual indicator for favorited jobs
- Persisted in JSON Server

### 4. 📊 Application Tracking

**Statuses:**
- `pending` - Application sent, awaiting response
- `accepted` - Interview or offer received
- `rejected` - Application declined

**Features:**
- Personal notes (optional)
- Status updates
- Delete tracking

---

## 🧪 Testing
```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --code-coverage

# Run e2e tests
npm run e2e
```

---

## 📦 Build for Production
```bash
# Build production bundle
npm run build

# Output directory
dist/job-finder/
```

### Deployment Options
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **Firebase**: `firebase deploy`

---

## 🎨 Design System

### Tailwind Configuration

Primary colors defined in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#3b82f6',  // Main brand color
    600: '#2563eb',  // Hover state
    700: '#1d4ed8',  // Active state
  }
}
```

### Custom CSS Classes

Defined in `src/styles.css`:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-danger` - Danger button style
- `.input-field` - Form input style
- `.card` - Card container
- `.alert-success` - Success message
- `.alert-error` - Error message

---

## 🔧 Technical Concepts Implemented

| Concept | Implementation | Status |
|---------|----------------|--------|
| **Angular 17+ Standalone** | All components standalone | ✅ |
| **NgRx State Management** | Favorites feature | ✅ |
| **RxJS Observables** | All async operations | ✅ |
| **Reactive Forms** | Login, Register, Profile | ✅ |
| **Dependency Injection** | Services with `inject()` | ✅ |
| **Route Guards** | `authGuard` (functional) | ✅ |
| **HTTP Interceptors** | `errorInterceptor` | ✅ |
| **Lazy Loading** | All feature routes | ✅ |
| **Parent/Child Components** | Job-search → Job-list → Job-card | ✅ |
| **Custom Pipes** | Date, currency formatting | ✅ |
| **Responsive Design** | Mobile-first with Tailwind | ✅ |

---

## 📊 JSON Server Database Structure

### `db.json`
```json
{
  "users": [
    {
      "id": 1,
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@jobfinder.com",
      "password": "Admin123!"
    }
  ],
  "favoritesOffers": [
    {
      "id": 1,
      "userId": 1,
      "jobId": "123",
      "title": "Angular Developer",
      "company": "Tech Corp",
      "location": "New York, NY",
      "description": "...",
      "url": "https://...",
      "salary": "$80k - $120k",
      "dateAdded": "2026-02-09T10:00:00Z"
    }
  ],
  "applications": [
    {
      "id": 1,
      "userId": 1,
      "jobId": "123",
      "apiSource": "adzuna",
      "title": "Angular Developer",
      "company": "Tech Corp",
      "location": "New York, NY",
      "url": "https://...",
      "status": "pending",
      "notes": "Applied on 2/9/2026",
      "dateAdded": "2026-02-09T10:00:00Z"
    }
  ]
}
```

---

## 📝 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Angular dev server |
| `npm run build` | Build for production |
| `npm test` | Run unit tests |
| `npm run serve:json` | Start JSON Server |
| `npm run dev` | Run both servers concurrently |

---

## 🐛 Troubleshooting

### Common Issues

**1. JSON Server not starting**
```bash
# Install globally
npm install -g json-server

# Or use npx
npx json-server --watch db.json --port 3000
```

**2. Tailwind styles not loading**
```bash
# Rebuild with Tailwind
npm run build
```

**3. API errors (CORS)**
- JSON Server automatically handles CORS
- For external APIs, check API key validity

**4. NgRx DevTools not working**
- Install Redux DevTools browser extension
- Check if `provideStoreDevtools()` is in `app.config.ts`

---

## 🚧 Future Enhancements

- [ ] Advanced search filters (salary range, experience level)
- [ ] Email notifications for application updates
- [ ] Resume/CV upload and management
- [ ] Company reviews and ratings
- [ ] Salary negotiation tips
- [ ] Interview preparation resources
- [ ] Dark mode toggle
- [ ] Multi-language support (i18n)
- [ ] PWA with offline support
- [ ] Real-time chat with recruiters

---

## 📖 Documentation

### Additional Resources

- [Angular Documentation](https://angular.dev/)
- [NgRx Documentation](https://ngrx.io/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Adzuna API Docs](https://developer.adzuna.com/)
- [JSON Server Docs](https://github.com/typicode/json-server)

---


## 🙏 Acknowledgments

- **Anthropic** - For Claude AI assistance
- **Adzuna** - For job listings API
- **Angular Team** - For the amazing framework
- **TailwindCSS** - For the utility-first CSS framework
- **NgRx Team** - For reactive state management

---
