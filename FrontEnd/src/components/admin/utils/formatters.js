/**
 * Utility functions for formatting data in analytics components 
 */

/**
 * Format currency values according to Vietnamese locale
 * @param {number} value - The value to format as currency
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};
