import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.unmock('../apps/client/src/contexts/LoadingContext.jsx');

import { LoadingProvider, useLoading } from '../apps/client/src/contexts/LoadingContext.jsx';

const Consumer = () => {
  const { isLoading, progress, startLoading, stopLoading, updateProgress } = useLoading();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="progress">{progress}</span>
      <button onClick={startLoading}>start</button>
      <button onClick={stopLoading}>stop</button>
      <button onClick={() => updateProgress(50)}>update</button>
    </div>
  );
};

describe('LoadingContext', () => {
  it('provides default isLoading=false and progress=0', () => {
    render(<LoadingProvider><Consumer /></LoadingProvider>);
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('progress').textContent).toBe('0');
  });

  it('startLoading sets isLoading to true', () => {
    render(<LoadingProvider><Consumer /></LoadingProvider>);
    act(() => { screen.getByText('start').click(); });
    expect(screen.getByTestId('loading').textContent).toBe('true');
  });

  it('stopLoading resets isLoading and progress', () => {
    render(<LoadingProvider><Consumer /></LoadingProvider>);
    act(() => { screen.getByText('start').click(); });
    act(() => { screen.getByText('stop').click(); });
    expect(screen.getByTestId('loading').textContent).toBe('false');
  });

  it('updateProgress updates value', () => {
    render(<LoadingProvider><Consumer /></LoadingProvider>);
    act(() => { screen.getByText('update').click(); });
    expect(screen.getByTestId('progress').textContent).toBe('50');
  });

  it('useLoading throws when used outside provider', () => {
    const Bad = () => { useLoading(); return null; };
    expect(() => render(<Bad />)).toThrow('useLoading must be used within');
  });
});
