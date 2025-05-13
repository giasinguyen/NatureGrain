import { useState, useCallback } from "react";
import { advancedAnalyticsService } from "../../services/api";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../ui/LoadingSpinner";
import useAnalyticsData from "./hooks/useAnalyticsData";

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const BasketAnalysisChart = () => {
  const [limit, setLimit] = useState(20);

  // Memoize the fetcher function to prevent unnecessary re-renders
  const fetchBasketAnalysis = useCallback(
    () => advancedAnalyticsService.getBasketAnalysis(limit),
    [limit]
  );

  const { data, loading, error } = useAnalyticsData(
    fetchBasketAnalysis,
    [],
    [limit]
  );

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="p-4 text-red-500">
        Lỗi khi tải dữ liệu phân tích giỏ hàng
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ShoppingBagIcon className="w-6 h-6 mr-2 text-indigo-500" />
          Phân tích giỏ hàng (Market Basket Analysis)
        </h2>
        <select
          className="bg-gray-100 border border-gray-300 rounded-md px-3 py-1 text-sm"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
        >
          <option value="10">Top 10</option>
          <option value="20">Top 20</option>
          <option value="50">Top 50</option>
        </select>
      </div>

      {data?.pairs && data.pairs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm mua cùng nhau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tần suất mua
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Độ tin cậy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hệ số nâng
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.pairs.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.product1}
                    </div>
                    <div className="text-sm text-gray-500">
                      + {item.product2}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.frequency} đơn
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {Math.round(item.confidence * 100)}%
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${item.confidence * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.lift > 2
                          ? "bg-green-100 text-green-800"
                          : item.lift > 1
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.lift.toFixed(2)}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">
          Không có đủ dữ liệu để phân tích giỏ hàng
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>
            <strong>Độ tin cậy</strong>: % khả năng khách mua sản phẩm A cũng sẽ
            mua sản phẩm B
          </p>
          <p className="mt-1">
            <strong>Hệ số nâng (Lift)</strong>: Mức độ hai sản phẩm thường được
            mua cùng nhau so với khi ngẫu nhiên. Lift &gt; 1 cho thấy mối liên
            hệ tích cực.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasketAnalysisChart;
