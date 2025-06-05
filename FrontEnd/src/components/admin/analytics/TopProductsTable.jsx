import React, { memo } from 'react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

/**
 * Component to display top selling products in a table
 */
const TopProductsTable = memo(({ products }) => {
  if (!products?.topSelling?.length) return null;

  // Helper function for formatting currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₫0';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Sản phẩm bán chạy nhất
        </h3>
        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
          Xem tất cả
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                Sản phẩm
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                Đã bán
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                Doanh thu
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                Xu hướng
              </th>
            </tr>
          </thead>
          <tbody>
            {products.topSelling.map((product, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                  {product.sales}
                </td>
                <td className="py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(product.revenue)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">+{(Math.random() * 20 + 5).toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

TopProductsTable.displayName = 'TopProductsTable';

export default TopProductsTable;
