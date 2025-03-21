import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';

const PaginationControl = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination className="mt-auto d-flex justify-content-center">
      <Pagination.Prev
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {[1, 2, 3, 4, 5].map((page) =>
        page <= totalPages ? (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Pagination.Item>
        ) : null
      )}

      <Pagination.Next
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </Pagination>
  );
};

// **Валидация пропсов**
PaginationControl.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default PaginationControl;
