/* eslint-disable no-undef */
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import PropTypes from 'prop-types'

// Mock environment variables
vi.stubEnv('VITE_API_URL', 'http://localhost:3001')
vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', 'test_clerk_key')
vi.stubEnv('VITE_STRIPE_PUBLISHABLE_KEY', 'test_stripe_key')

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock scrollTo
global.scrollTo = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock fetch
global.fetch = vi.fn()

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  
  const MockLink = ({ children, to, ...props }) => {
    const Link = actual.Link
    return Link ? Link({ children, to, ...props }) : <a href={to} {...props}>{children}</a>
  }
  
  MockLink.propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired
  }
  
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
    Link: MockLink
  }
})

// Mock @clerk/clerk-react
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
      emailAddresses: [{ emailAddress: 'test@example.com' }]
    },
    isLoaded: true,
    isSignedIn: true
  }),
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: true,
    userId: 'test-user-id'
  }),
  ClerkProvider: ({ children }) => children,
  SignedIn: ({ children }) => children,
  SignedOut: ({ children }) => children
}))

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en'
    }
  })
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn()
  }
}))

// Mock react-helmet-async
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => children,
  HelmetProvider: ({ children }) => children
}))

// Mock react-loading-skeleton
vi.mock('react-loading-skeleton', () => ({
  default: ({ children, ...props }) => <div data-testid="skeleton" {...props}>{children}</div>
}))

// Mock react-bootstrap-icons
vi.mock('react-bootstrap-icons', () => ({
  Facebook: () => <span data-testid="facebook-icon">Facebook</span>,
  Gear: () => <span data-testid="gear-icon">Gear</span>,
  Envelope: () => <span data-testid="envelope-icon">Envelope</span>,
  Plus: () => <span data-testid="plus-icon">Plus</span>,
  Trash: () => <span data-testid="trash-icon">Trash</span>,
  CheckCircle: () => <span data-testid="check-circle-icon">CheckCircle</span>,
  XCircle: () => <span data-testid="x-circle-icon">XCircle</span>,
  People: () => <span data-testid="people-icon">People</span>,
  ExclamationTriangle: () => <span data-testid="exclamation-triangle-icon">ExclamationTriangle</span>,
  InfoCircle: () => <span data-testid="info-circle-icon">InfoCircle</span>,
  PencilSquare: () => <span data-testid="pencil-square-icon">PencilSquare</span>,
  SortUp: () => <span data-testid="sort-up-icon">SortUp</span>,
  X: () => <span data-testid="x-icon">X</span>
}))

// Mock bootstrap-icons
vi.mock('bootstrap-icons', () => ({
  default: {
    Facebook: () => <span data-testid="facebook-icon">Facebook</span>,
    Gear: () => <span data-testid="gear-icon">Gear</span>,
    Envelope: () => <span data-testid="envelope-icon">Envelope</span>,
    Plus: () => <span data-testid="plus-icon">Plus</span>,
    Trash: () => <span data-testid="trash-icon">Trash</span>,
    CheckCircle: () => <span data-testid="check-circle-icon">CheckCircle</span>,
    XCircle: () => <span data-testid="x-circle-icon">XCircle</span>,
    People: () => <span data-testid="people-icon">People</span>,
    ExclamationTriangle: () => <span data-testid="exclamation-triangle-icon">ExclamationTriangle</span>,
    InfoCircle: () => <span data-testid="info-circle-icon">InfoCircle</span>
  }
}))

// Mock bootstrap-icons CSS import
vi.mock('bootstrap-icons/font/bootstrap-icons.css', () => ({}), { virtual: true })

// Mock all CSS imports
vi.mock('*.css', () => ({}), { virtual: true })
vi.mock('*.scss', () => ({}), { virtual: true })

// Mock specific CSS imports that might cause issues
vi.mock('bootstrap-icons/font/bootstrap-icons.css', () => ({}), { virtual: true })
vi.mock('bootstrap/dist/css/bootstrap.min.css', () => ({}), { virtual: true })
vi.mock('bootstrap/dist/css/bootstrap.css', () => ({}), { virtual: true })

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }) => children
}))

// Mock ImageModal component
vi.mock('../apps/client/src/components/ui/ImageModal.jsx', () => ({
  default: ({ show, onHide, imageUrl, imageAlt, onImageError, children, ...props }) => {
    if (!show || !imageUrl) return null;
    return (
      <div data-testid="image-modal" {...props}>
        <img src={imageUrl} alt={imageAlt} onError={onImageError} />
        <button onClick={onHide}>Close</button>
        {children}
      </div>
    );
  }
}))

// Mock the ui index file to export ImageModal
vi.mock('../apps/client/src/components/ui', () => ({
  ImageModal: ({ show, onHide, imageUrl, imageAlt, onImageError, children, ...props }) => {
    if (!show || !imageUrl) return null;
    return (
      <div data-testid="image-modal" {...props}>
        <img src={imageUrl} alt={imageAlt} onError={onImageError} />
        <button onClick={onHide}>Close</button>
        {children}
      </div>
    );
  }
}))

// Mock react-select
vi.mock('react-select', () => ({
  default: ({ children, ...props }) => <select {...props}>{children}</select>
}))

// Mock the zod resolver
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn(() => ({
    validate: vi.fn(() => ({ success: true, data: {} })),
    validateAsync: vi.fn(() => Promise.resolve({ success: true, data: {} }))
  }))
}))

// Mock ImageUploadContext
vi.mock('../apps/client/src/contexts/ImageUploadContext.jsx', () => ({
  useImageUpload: () => ({
    uploadImage: vi.fn().mockResolvedValue('test-image-url'),
    uploading: false,
    uploadError: null,
    clearError: vi.fn()
  })
}))

// Mock LoadingContext
vi.mock('../apps/client/src/contexts/LoadingContext.jsx', () => ({
  useLoading: () => ({
    startLoading: vi.fn(),
    stopLoading: vi.fn(),
    updateProgress: vi.fn()
  }),
  LoadingProvider: ({ children }) => children
}))

// Mock custom hooks
vi.mock('../apps/client/src/hooks/useFetchCities.js', () => ({
  default: () => ({
    cities: [
      { value: 1, label: 'Tel Aviv' },
      { value: 2, label: 'Jerusalem' },
      { value: 3, label: 'Haifa' }
    ],
    loading: false
  })
}))

vi.mock('../apps/client/src/hooks/useFetchCategories.js', () => ({
  default: () => ({
    categories: [
      { value: 1, label: 'Construction' },
      { value: 2, label: 'Cleaning' },
      { value: 3, label: 'Delivery' }
    ],
    loading: false
  })
}))

vi.mock('../apps/client/src/hooks/useLoadingProgress.js', () => ({
  useLoadingProgress: () => ({
    startLoadingWithProgress: vi.fn(),
    completeLoading: vi.fn()
  })
})) 