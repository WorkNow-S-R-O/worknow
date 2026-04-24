import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('libs', () => ({ cn: (...args) => args.filter(Boolean).join(' ') }));

// Mock @radix-ui/react-slot since spinner.jsx references Slot without importing it
vi.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }) => <span {...props}>{children}</span>,
}));

import { Spinner } from '../apps/client/src/components/ui/spinner.jsx';

describe('Spinner', () => {
  it('renders 8 leaf spans when loading=true', () => {
    const { container } = render(<Spinner loading={true} />);
    const leaves = container.querySelectorAll('.animate-spinner-leaf-fade');
    expect(leaves).toHaveLength(8);
  });

  it('renders nothing when loading=false', () => {
    const { container } = render(<Spinner loading={false} />);
    expect(container.firstChild).toBeNull();
  });
});
