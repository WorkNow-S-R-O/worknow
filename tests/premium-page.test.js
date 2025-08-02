import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider, useUser, useClerk } from '@clerk/clerk-react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../apps/client/src/18n';
import PremiumPage from '../apps/client/src/components/PremiumPage';

// Mock the hooks
jest.mock('@clerk/clerk-react', () => ({
  useUser: jest.fn(),
  useClerk: jest.fn(),
  ClerkProvider: ({ children }) => children,
}));

jest.mock('../apps/client/src/hooks/useUserSync', () => ({
  useUserSync: jest.fn(),
}));

jest.mock('../apps/client/src/hooks/useLoadingProgress', () => ({
  useLoadingProgress: jest.fn(),
}));

jest.mock('axios');

// Mock components
const MockPremiumPage = ({ user, dbUser, userLoading, userError }) => {
  const { useUserSync } = require('../apps/client/src/hooks/useUserSync');
  const { useLoadingProgress } = require('../apps/client/src/hooks/useLoadingProgress');
  
  useUser.mockReturnValue(user);
  useClerk.mockReturnValue({ redirectToSignIn: jest.fn() });
  useUserSync.mockReturnValue({ 
    dbUser, 
    loading: userLoading, 
    error: userError, 
    refreshUser: jest.fn() 
  });
  useLoadingProgress.mockReturnValue({ 
    startLoadingWithProgress: jest.fn(), 
    completeLoading: jest.fn() 
  });

  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <PremiumPage />
      </BrowserRouter>
    </I18nextProvider>
  );
};

describe('PremiumPage Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('Free Plan Button Behavior', () => {
    test('should show "Использовать бесплатно" and redirect to sign in when user is not logged in', () => {
      const mockRedirectToSignIn = jest.fn();
      useClerk.mockReturnValue({ redirectToSignIn: mockRedirectToSignIn });

      render(<MockPremiumPage user={null} dbUser={null} userLoading={false} userError={null} />);
      
      const freeButton = screen.getByText('Использовать бесплатно');
      expect(freeButton).toBeInTheDocument();
      
      fireEvent.click(freeButton);
      expect(mockRedirectToSignIn).toHaveBeenCalled();
    });

    test('should show "Активен" and be disabled when user is logged in', () => {
      render(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={{ isPremium: false, premiumDeluxe: false }} 
        userLoading={false} 
        userError={null} 
      />);
      
      const freeButton = screen.getByText('Активен');
      expect(freeButton).toBeInTheDocument();
      expect(freeButton).toBeDisabled();
    });

    test('should show "Использовать бесплатно" when user is logged in but not active', () => {
      render(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={null} 
        userLoading={false} 
        userError={null} 
      />);
      
      const freeButton = screen.getByText('Использовать бесплатно');
      expect(freeButton).toBeInTheDocument();
      expect(freeButton).not.toBeDisabled();
    });
  });

  describe('Pro Plan Button Behavior', () => {
    test('should show "Купить Premium" when user has no premium', () => {
      render(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={{ isPremium: false, premiumDeluxe: false }} 
        userLoading={false} 
        userError={null} 
      />);
      
      const proButton = screen.getByText('Купить Premium');
      expect(proButton).toBeInTheDocument();
      expect(proButton).not.toBeDisabled();
    });

    test('should show "Активен" and be disabled when user has Pro subscription', () => {
      render(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={{ isPremium: true, premiumDeluxe: false }} 
        userLoading={false} 
        userError={null} 
      />);
      
      const proButton = screen.getByText('Активен');
      expect(proButton).toBeInTheDocument();
      expect(proButton).toBeDisabled();
    });

    test('should show "Активен" and be disabled when user has Enterprise subscription', () => {
      render(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={{ isPremium: true, premiumDeluxe: true }} 
        userLoading={false} 
        userError={null} 
      />);
      
      const proButton = screen.getByText('Активен');
      expect(proButton).toBeInTheDocument();
      expect(proButton).toBeDisabled();
    });
  });

  describe('Enterprise Plan Button Behavior', () => {
    test('should show "Купить Enterprise" with 199₪ when user has no premium', () => {
      render(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={{ isPremium: false, premiumDeluxe: false }} 
        userLoading={false} 
        userError={null} 
      />);
      
      const enterpriseButton = screen.getByText('Купить Enterprise');
      expect(enterpriseButton).toBeInTheDocument();
      expect(enterpriseButton).not.toBeDisabled();
      
      // Check price display
      const priceElement = screen.getByText('199₪');
      expect(priceElement).toBeInTheDocument();
    });

    test('should show "Улучшить до Enterprise" with 100₪ when user has Pro but not Enterprise', () => {
      render(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={{ isPremium: true, premiumDeluxe: false }} 
        userLoading={false} 
        userError={null} 
      />);
      
      const enterpriseButton = screen.getByText('Улучшить до Enterprise');
      expect(enterpriseButton).toBeInTheDocument();
      expect(enterpriseButton).not.toBeDisabled();
      
      // Check price display
      const priceElement = screen.getByText('100₪');
      expect(priceElement).toBeInTheDocument();
    });

    test('should show "Активен" and be disabled when user has Enterprise subscription', () => {
      render(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={{ isPremium: true, premiumDeluxe: true }} 
        userLoading={false} 
        userError={null} 
      />);
      
      const enterpriseButton = screen.getByText('Активен');
      expect(enterpriseButton).toBeInTheDocument();
      expect(enterpriseButton).toBeDisabled();
    });
  });

  describe('Loading States', () => {
    test('should show loading spinner when user is logged in but data is loading', () => {
      render(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={null} 
        userLoading={true} 
        userError={null} 
      />);
      
      const loadingSpinner = screen.getByRole('status');
      expect(loadingSpinner).toBeInTheDocument();
    });

    test('should show error message when there is a user error', () => {
      render(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={null} 
        userLoading={false} 
        userError="Failed to load user data" 
      />);
      
      const errorMessage = screen.getByText(/Ошибка загрузки данных пользователя/);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Plan Status Logic', () => {
    test('should correctly determine active plans based on user subscription', () => {
      const { rerender } = render(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={{ isPremium: false, premiumDeluxe: false }} 
        userLoading={false} 
        userError={null} 
      />);
      
      // Free should be active, Pro and Enterprise should not be
      expect(screen.getByText('Активен')).toBeInTheDocument(); // Free plan
      expect(screen.getByText('Купить Premium')).toBeInTheDocument(); // Pro plan
      expect(screen.getByText('Купить Enterprise')).toBeInTheDocument(); // Enterprise plan

      // Test with Pro subscription
      rerender(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={{ isPremium: true, premiumDeluxe: false }} 
        userLoading={false} 
        userError={null} 
      />);
      
      expect(screen.getAllByText('Активен')).toHaveLength(2); // Free and Pro
      expect(screen.getByText('Улучшить до Enterprise')).toBeInTheDocument(); // Enterprise upgrade

      // Test with Enterprise subscription
      rerender(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={{ isPremium: true, premiumDeluxe: true }} 
        userLoading={false} 
        userError={null} 
      />);
      
      expect(screen.getAllByText('Активен')).toHaveLength(3); // All plans active
    });
  });

  describe('Payment Flow', () => {
    test('should handle payment initiation correctly', async () => {
      const mockAxios = require('axios');
      mockAxios.post.mockResolvedValue({ data: { url: 'https://stripe.com/checkout' } });

      render(<MockPremiumPage 
        user={{ id: 'user123' }} 
        dbUser={{ isPremium: false, premiumDeluxe: false }} 
        userLoading={false} 
        userError={null} 
      />);
      
      const proButton = screen.getByText('Купить Premium');
      fireEvent.click(proButton);
      
      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/payments/create-checkout-session'),
          expect.objectContaining({
            clerkUserId: 'user123'
          })
        );
      });
    });

    test('should redirect to sign in when user is not logged in and tries to pay', () => {
      const mockRedirectToSignIn = jest.fn();
      useClerk.mockReturnValue({ redirectToSignIn: mockRedirectToSignIn });

      render(<MockPremiumPage 
        user={null} 
        dbUser={null} 
        userLoading={false} 
        userError={null} 
      />);
      
      const proButton = screen.getByText('Купить Premium');
      fireEvent.click(proButton);
      
      expect(mockRedirectToSignIn).toHaveBeenCalled();
    });
  });
}); 