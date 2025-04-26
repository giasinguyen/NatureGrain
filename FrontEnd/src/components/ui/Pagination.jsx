import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
  siblingCount = 1,
}) => {
  // Nếu chỉ có 1 trang thì không hiển thị pagination
  if (totalPages <= 1) return null;

  // Giới hạn số trang hiển thị
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  // Xác định khi nào hiển thị dấu "..."
  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  // Luôn hiển thị trang đầu và trang cuối
  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  // Hàm tạo mảng các trang cần hiển thị
  const generatePagination = () => {
    const pages = [];

    // Luôn hiển thị trang đầu tiên
    if (firstPageIndex < leftSiblingIndex) {
      pages.push(firstPageIndex);
    }

    // Hiển thị dấu "..." bên trái nếu cần
    if (showLeftDots) {
      pages.push('LEFT_DOTS');
    }

    // Thêm các trang ở giữa (gần trang hiện tại)
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }

    // Hiển thị dấu "..." bên phải nếu cần
    if (showRightDots) {
      pages.push('RIGHT_DOTS');
    }

    // Luôn hiển thị trang cuối cùng
    if (rightSiblingIndex < lastPageIndex) {
      pages.push(lastPageIndex);
    }

    return pages;
  };

  const pages = generatePagination();

  // Xử lý khi click vào nút Previous
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Xử lý khi click vào nút Next
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Xử lý khi click vào nút "..."
  const handleDots = (type) => {
    if (type === 'LEFT_DOTS') {
      onPageChange(Math.max(1, currentPage - 5));
    } else {
      onPageChange(Math.min(totalPages, currentPage + 5));
    }
  };

  return (
    <div className={`flex justify-center items-center space-x-1 py-4 ${className}`}>
      {/* Nút Previous */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`flex items-center justify-center px-3 py-2 rounded-md ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {/* Các nút trang */}
      {pages.map((page, index) => {
        if (page === 'LEFT_DOTS' || page === 'RIGHT_DOTS') {
          return (
            <button
              key={`dots-${index}`}
              className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => handleDots(page)}
            >
              ...
            </button>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-md ${
              currentPage === page
                ? 'bg-green-600 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Nút Next */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center px-3 py-2 rounded-md ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;