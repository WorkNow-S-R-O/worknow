import { Pagination } from 'react-bootstrap';
import PropTypes from 'prop-types';

const PaginationControl = ({ currentPage, totalPages, onPageChange }) => {
  // Generate sliding page numbers (always show 5 pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Always show exactly 5 page numbers
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is small, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // For many pages, show 5 pages around current page
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      // Adjust start if we're near the end
      if (end === totalPages) {
        start = Math.max(1, totalPages - maxVisiblePages + 1);
      }
      
      // Show pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <Pagination className="mt-auto d-flex justify-content-center">
      <Pagination.Prev
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {getPageNumbers().map((page) => (
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      ))}

      <Pagination.Next
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </Pagination>
  );
};

// PropTypes validation
PaginationControl.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default PaginationControl;
