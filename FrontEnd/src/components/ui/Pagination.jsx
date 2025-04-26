import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) {
  // Nếu chỉ có 1 trang thì không hiển thị phân trang
  if (totalPages <= 1) return null;

  // Tạo mảng các số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Số trang tối đa hiển thị
    
    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang <= 5, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Tính toán khoảng trang sẽ hiển thị
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      // Điều chỉnh nếu khoảng không đủ trang
      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      // Thêm trang đầu và dấu ...
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      // Thêm các trang ở giữa
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Thêm trang cuối và dấu ...
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Xử lý khi người dùng click vào số trang
  const handlePageClick = (page) => {
    if (page !== currentPage && page !== '...') {
      onPageChange(page);
    }
  };

  // Xử lý khi người dùng click vào nút Previous/Next
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 
            ${currentPage === 1 
              ? 'bg-gray-100 cursor-not-allowed' 
              : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}
          aria-label="Previous page"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        
        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`relative inline-flex items-center px-4 py-2 text-sm
              ${page === currentPage
                ? 'z-10 bg-primary-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                : page === '...'
                  ? 'text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 cursor-default'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              }`}
          >
            {page}
          </button>
        ))}
        
        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300
            ${currentPage === totalPages 
              ? 'bg-gray-100 cursor-not-allowed' 
              : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}
          aria-label="Next page"
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}