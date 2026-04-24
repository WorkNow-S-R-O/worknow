import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FilterIcon from '../apps/client/src/components/ui/FilterIcon.jsx';

describe('FilterIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(<FilterIcon />);
    expect(container.querySelector('.bi-gear')).toBeInTheDocument();
  });
});
