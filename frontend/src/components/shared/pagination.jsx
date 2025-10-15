// Pagination.jsx
import React from 'react';

function Pagination({ currentPage, totalPages, onNext, onPrevious }) {
  return (
    <div className="flex justify-center items-center mt-8 space-x-4">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 hovTransition disabled:bg-gray-300"
      >
        Prev
      </button>
      
      <span className="text-gray-700 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 hovTransition"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;