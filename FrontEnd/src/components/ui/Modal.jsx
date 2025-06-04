import { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  showCloseButton = true,
  footer = null,
  centerContent = false,
  contentClassName = ''
}) => {
  const modalRef = useRef(null);

  // Xử lý đóng modal khi nhấn phím Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Xử lý đóng modal khi click bên ngoài
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Ngăn không cho cuộn trang khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  // Xác định kích thước modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
    '3xl': 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleOutsideClick}
    >
      <div 
        ref={modalRef} 
        className={`${sizeClass} w-full bg-white rounded-lg shadow-lg overflow-hidden animate-modal-fade-in`}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            {showCloseButton && (
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>        )}
        <div className={`p-4 max-h-[calc(100vh-10rem)] overflow-y-auto ${contentClassName} ${centerContent ? 'flex items-center justify-center' : ''}`}>
          {children}
        </div>
        
        {footer && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
