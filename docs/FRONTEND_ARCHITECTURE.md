# WorkNow Frontend Architecture

## Overview

The WorkNow frontend is built with **React 18** and **Vite**, featuring a component-based architecture with modern hooks, state management via Zustand, and comprehensive internationalization support.

## Technology Stack

### Core Technologies
- **React 18** - UI library with concurrent features
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety and developer experience
- **React Router DOM 7** - Client-side routing

### State Management
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Bootstrap 5** - Component library
- **CSS Modules** - Component-scoped styles

### Authentication & Payments
- **Clerk** - Authentication provider
- **Stripe** - Payment processing
- **React Hot Toast** - Notifications

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── form/           # Form components
│   ├── routes/         # Route-specific components
│   ├── ui/             # Base UI components
│   └── [feature components]
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── store/              # Zustand state stores
├── lib/                # Utilities and configurations
├── css/                # Stylesheets
└── tests/              # Test files
```

## Component Architecture

### 1. Core Components

#### App.jsx
Main application wrapper with providers and routing setup.

```jsx
function App() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}
```

#### Layout Components
- **Navbar** - Main navigation with language switcher
- **Footer** - Application footer
- **ProtectedRoute** - Authentication wrapper

### 2. Feature Components

#### Job Management
- **JobCard** - Individual job listing display
- **JobList** - Job listings with pagination
- **JobForm** - Job creation/editing form
- **JobFilterModal** - Advanced filtering interface

#### User Management
- **UserProfile** - User profile management
- **UserHeader** - User navigation header
- **UserJobs** - User's job listings

#### Premium Features
- **PremiumPage** - Premium features showcase
- **BillingPage** - Subscription management
- **CancelSubscription** - Subscription cancellation

### 3. Form Components

#### JobForm.jsx
Multi-step form with validation and file upload.

```jsx
function JobForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(jobFormSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <JobFormFields register={register} errors={errors} />
      <ImageUpload />
      <button type="submit">Create Job</button>
    </form>
  );
}
```

#### Form Validation
- **Zod schemas** for type-safe validation
- **React Hook Form** for form state management
- **Custom validation rules** for business logic

## State Management

### 1. Zustand Stores

#### languageStore.ts
Internationalization state management.

```typescript
interface LanguageState {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  isLoading: boolean;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLanguage: 'en',
  setLanguage: (lang) => set({ currentLanguage: lang }),
  isLoading: false
}));
```

#### filterStore.js
Job filtering and search state.

```javascript
export const useFilterStore = create((set) => ({
  searchTerm: '',
  selectedCategory: null,
  selectedCity: null,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setCategory: (category) => set({ selectedCategory: category }),
  setCity: (city) => set({ selectedCity: city }),
  clearFilters: () => set({ 
    searchTerm: '', 
    selectedCategory: null, 
    selectedCity: null 
  })
}));
```

### 2. Custom Hooks

#### useJobs.js
Job data management with pagination.

```javascript
export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });

  const fetchJobs = async (params) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/jobs?${new URLSearchParams(params)}`);
      const data = await response.json();
      setJobs(data.items);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return { jobs, loading, pagination, fetchJobs };
};
```

#### useUpdateJobs.js
Job modification operations.

```javascript
export const useUpdateJobs = () => {
  const { getToken } = useAuth();

  const createJob = async (jobData) => {
    const token = await getToken();
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobData)
    });
    return response.json();
  };

  const updateJob = async (id, jobData) => {
    const token = await getToken();
    const response = await fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobData)
    });
    return response.json();
  };

  return { createJob, updateJob };
};
```

## Routing Architecture

### 1. Route Structure

```jsx
<Routes>
  {/* Public routes */}
  <Route path="/" element={<Home />} />
  <Route path="/jobs" element={<Jobs />} />
  <Route path="/seekers" element={<Seekers />} />
  <Route path="/premium" element={<Premium />} />
  
  {/* Protected routes */}
  <Route path="/profile" element={
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  } />
  <Route path="/create-job" element={
    <ProtectedRoute>
      <CreateJob />
    </ProtectedRoute>
  } />
  <Route path="/my-jobs" element={
    <ProtectedRoute>
      <MyJobs />
    </ProtectedRoute>
  } />
  
  {/* Payment routes */}
  <Route path="/success" element={<Success />} />
  <Route path="/cancel" element={<Cancel />} />
</Routes>
```

### 2. Protected Routes

```jsx
function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}
```

## Internationalization

### 1. i18n Setup

```typescript
// src/18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ru: { translation: ruTranslation },
      he: { translation: heTranslation },
      ar: { translation: arTranslation }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });
```

### 2. Language Switching

```jsx
function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { setLanguage } = useLanguageStore();

  const handleLanguageChange = async (langCode) => {
    await i18n.changeLanguage(langCode);
    setLanguage(langCode);
    
    // Update document direction for RTL
    document.documentElement.dir = ['he', 'ar'].includes(langCode) ? 'rtl' : 'ltr';
  };

  return (
    <select onChange={(e) => handleLanguageChange(e.target.value)}>
      <option value="en">English</option>
      <option value="ru">Русский</option>
      <option value="he">עברית</option>
      <option value="ar">العربية</option>
    </select>
  );
}
```

## Component Patterns

### 1. Compound Components

```jsx
function JobCard({ job, children }) {
  return (
    <div className="job-card">
      <div className="job-header">
        <h3>{job.title}</h3>
        <span className="salary">{job.salary}</span>
      </div>
      <p className="description">{job.description}</p>
      {children}
    </div>
  );
}

// Usage
<JobCard job={job}>
  <div className="job-actions">
    <button>Contact</button>
    <button>Save</button>
  </div>
</JobCard>
```

### 2. Render Props Pattern

```jsx
function JobList({ renderJob, jobs }) {
  return (
    <div className="job-list">
      {jobs.map(job => renderJob(job))}
    </div>
  );
}

// Usage
<JobList 
  jobs={jobs} 
  renderJob={(job) => <JobCard key={job.id} job={job} />} 
/>
```

### 3. Custom Hooks Pattern

```jsx
function useJobActions(jobId) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const boostJob = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      await fetch(`/api/jobs/${jobId}/boost`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } finally {
      setLoading(false);
    }
  };

  return { boostJob, loading };
}
```

## Performance Optimization

### 1. Code Splitting

```jsx
// Lazy load components
const UserProfile = lazy(() => import('./pages/UserProfile'));
const PremiumPage = lazy(() => import('./pages/PremiumPage'));

// Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <UserProfile />
</Suspense>
```

### 2. Memoization

```jsx
const JobCard = memo(({ job, onContact }) => {
  const handleContact = useCallback(() => {
    onContact(job.id);
  }, [job.id, onContact]);

  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <button onClick={handleContact}>Contact</button>
    </div>
  );
});
```

### 3. Virtual Scrolling

```jsx
import { FixedSizeList as List } from 'react-window';

function VirtualizedJobList({ jobs }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <JobCard job={jobs[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={jobs.length}
      itemSize={200}
    >
      {Row}
    </List>
  );
}
```

## Testing Strategy

### 1. Component Testing

```jsx
// JobCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import JobCard from './JobCard';

describe('JobCard', () => {
  test('displays job information', () => {
    const mockJob = {
      id: 1,
      title: 'Test Job',
      salary: '1000 NIS',
      description: 'Test description'
    };

    render(<JobCard job={mockJob} />);
    
    expect(screen.getByText('Test Job')).toBeInTheDocument();
    expect(screen.getByText('1000 NIS')).toBeInTheDocument();
  });
});
```

### 2. Hook Testing

```jsx
// useJobs.test.js
import { renderHook, act } from '@testing-library/react';
import { useJobs } from './useJobs';

describe('useJobs', () => {
  test('fetches jobs successfully', async () => {
    const { result } = renderHook(() => useJobs());
    
    await act(async () => {
      await result.current.fetchJobs({ page: 1 });
    });
    
    expect(result.current.jobs).toHaveLength(10);
    expect(result.current.loading).toBe(false);
  });
});
```

## Error Handling

### 1. Error Boundaries

```jsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 2. API Error Handling

```jsx
function useApiError() {
  const [error, setError] = useState(null);

  const handleError = useCallback((error) => {
    if (error.response?.status === 401) {
      // Handle authentication error
      signOut();
    } else if (error.response?.status === 403) {
      // Handle permission error
      toast.error('You do not have permission for this action');
    } else {
      // Handle general error
      toast.error('An error occurred. Please try again.');
    }
    setError(error);
  }, []);

  return { error, handleError };
}
```

## Accessibility

### 1. ARIA Labels

```jsx
function JobCard({ job }) {
  return (
    <article 
      className="job-card"
      aria-labelledby={`job-title-${job.id}`}
      aria-describedby={`job-description-${job.id}`}
    >
      <h3 id={`job-title-${job.id}`}>{job.title}</h3>
      <p id={`job-description-${job.id}`}>{job.description}</p>
      <button aria-label={`Contact employer for ${job.title}`}>
        Contact
      </button>
    </article>
  );
}
```

### 2. Keyboard Navigation

```jsx
function JobList({ jobs }) {
  const handleKeyDown = (event, jobId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleJobSelect(jobId);
    }
  };

  return (
    <div role="list">
      {jobs.map(job => (
        <div
          key={job.id}
          role="listitem"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, job.id)}
          onClick={() => handleJobSelect(job.id)}
        >
          <JobCard job={job} />
        </div>
      ))}
    </div>
  );
}
```

## Conclusion

The WorkNow frontend architecture provides:

- **Modular component structure** for maintainability
- **Efficient state management** with Zustand
- **Type-safe development** with TypeScript
- **Performance optimization** through code splitting and memoization
- **Comprehensive testing** strategy
- **Accessibility compliance** with ARIA and keyboard navigation
- **Internationalization support** for multiple languages

This architecture ensures scalability, maintainability, and excellent user experience across all supported platforms and languages.
