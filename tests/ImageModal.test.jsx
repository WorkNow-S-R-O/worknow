import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Unmock ImageModal since setup.jsx mocks it globally
vi.unmock('../apps/client/src/components/ui/ImageModal.jsx');

vi.mock('react-bootstrap', () => {
  const ModalComp = ({ show, children }) => show ? <div data-testid="modal">{children}</div> : null;
  ModalComp.Body = ({ children }) => <div>{children}</div>;
  ModalComp.Header = ({ children }) => <div>{children}</div>;
  ModalComp.Title = ({ children }) => <div>{children}</div>;
  ModalComp.Footer = ({ children }) => <div>{children}</div>;
  return {
    Modal: ModalComp,
    Button: ({ onClick, children }) => <button onClick={onClick}>{children}</button>,
  };
});

import ImageModal from '../apps/client/src/components/ui/ImageModal.jsx';

describe('ImageModal', () => {
  it('renders nothing when imageUrl is not provided', () => {
    const { container } = render(<ImageModal show={true} onHide={vi.fn()} imageUrl={null} imageAlt="test" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when show=true and imageUrl provided', () => {
    render(<ImageModal show={true} onHide={vi.fn()} imageUrl="https://ex.com/img.jpg" imageAlt="Job" />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('does not render modal when show=false', () => {
    render(<ImageModal show={false} onHide={vi.fn()} imageUrl="https://ex.com/img.jpg" imageAlt="Job" />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});
