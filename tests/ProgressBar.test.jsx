import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from '../apps/client/src/components/ui/ProgressBar.jsx';
import { LoadingProvider } from '../apps/client/src/contexts/LoadingContext.jsx';

describe('ProgressBar', () => {
  it('is not visible when not loading', () => {
    const { container } = render(<LoadingProvider><ProgressBar /></LoadingProvider>);
    expect(container.firstChild).toBeNull();
  });
});
