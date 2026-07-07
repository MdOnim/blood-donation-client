import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200"
      >
        <FaChevronLeft size={14} />
      </button>
      <span className="text-sm text-muted">
        Page         <span className="font-semibold text-gray-800 dark:text-gray-100">{page}</span> of{' '}
        <span className="font-semibold text-gray-800 dark:text-gray-100">{totalPages}</span>
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200"
      >
        <FaChevronRight size={14} />
      </button>
    </div>
  );
};

export default Pagination;
