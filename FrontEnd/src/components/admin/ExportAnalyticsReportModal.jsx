import { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { 
  analyticsService, 
  advancedAnalyticsService 
} from '../../services/api';
import { 
  DocumentArrowDownIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon, 
  ClockIcon
} from '@heroicons/react/24/outline';

const ExportAnalyticsReportModal = ({ isOpen, onClose }) => {
  const [exportOptions, setExportOptions] = useState({
    includeBasicAnalytics: true,
    includeRfmAnalysis: true,
    includeBasketAnalysis: true,
    includeCohortAnalysis: true,
    includeClvAnalysis: true,
    dateRange: 'last30',
  });

  const [exportData, setExportData] = useState({
    salesTrends: null,
    productPerformance: null,
    customerRetention: null,
    rfmAnalysis: null,
    basketAnalysis: null,
    cohortAnalysis: null,
    clvAnalysis: null,
  });

  const [exportStatus, setExportStatus] = useState({
    loading: false,
    progress: 0,
    complete: false,
    error: null,
  });

  const dateRangeOptions = [
    { id: 'last7', name: '7 ngày qua' },
    { id: 'last30', name: '30 ngày qua' },
    { id: 'last90', name: '90 ngày qua' },
    { id: 'last365', name: '1 năm qua' },
    { id: 'all', name: 'Toàn bộ dữ liệu' }
  ];

  // Get days from selected date range
  const getDaysFromRange = (range) => {
    switch(range) {
      case 'last7': return 7;
      case 'last30': return 30;
      case 'last90': return 90;
      case 'last365': return 365;
      case 'all': return 9999; // Effectively all data
      default: return 30;
    }
  };

  const handleOptionChange = (option) => {
    setExportOptions({
      ...exportOptions,
      [option]: !exportOptions[option]
    });
  };

  const handleDateRangeChange = (e) => {
    setExportOptions({
      ...exportOptions,
      dateRange: e.target.value
    });
  };

  const generateExportFilename = () => {
    const date = new Date().toISOString().split('T')[0];
    return `naturegrain_analytics_report_${date}.csv`;
  };

  const prepareExport = async () => {
    setExportStatus({
      loading: true,
      progress: 0,
      complete: false,
      error: null,
    });
    
    try {
      const days = getDaysFromRange(exportOptions.dateRange);
      const dataPromises = [];
      const dataTypes = [];
      
      // Basic analytics
      if (exportOptions.includeBasicAnalytics) {
        dataPromises.push(analyticsService.getSalesTrends('daily', days));
        dataTypes.push('salesTrends');
        
        dataPromises.push(analyticsService.getProductPerformance());
        dataTypes.push('productPerformance');
        
        dataPromises.push(analyticsService.getCustomerRetention());
        dataTypes.push('customerRetention');
      }
      
      // Advanced analytics
      if (exportOptions.includeRfmAnalysis) {
        dataPromises.push(advancedAnalyticsService.getRfmAnalysis());
        dataTypes.push('rfmAnalysis');
      }
      
      if (exportOptions.includeBasketAnalysis) {
        dataPromises.push(advancedAnalyticsService.getBasketAnalysis(100));
        dataTypes.push('basketAnalysis');
      }
      
      if (exportOptions.includeCohortAnalysis) {
        dataPromises.push(advancedAnalyticsService.getUserCohortAnalysis());
        dataTypes.push('cohortAnalysis');
      }
      
      if (exportOptions.includeClvAnalysis) {
        dataPromises.push(advancedAnalyticsService.getCustomerLifetimeValue());
        dataTypes.push('clvAnalysis');
      }
      
      // Fetch data with progress tracking
      const results = await Promise.allSettled(dataPromises.map((promise, index) => {
        return promise.then(result => {
          // Update progress
          setExportStatus(prev => ({
            ...prev,
            progress: Math.floor((index + 1) / dataPromises.length * 100)
          }));
          return result;
        });
      }));
      
      // Process results
      const exportData = {};
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          exportData[dataTypes[index]] = result.value.data;
        } else {
          console.error(`Error fetching ${dataTypes[index]}:`, result.reason);
        }
      });
      
      setExportData(exportData);
      setExportStatus({
        loading: false,
        progress: 100,
        complete: true,
        error: null,
      });
    } catch (error) {
      console.error('Error preparing export:', error);
      setExportStatus({
        loading: false,
        progress: 0,
        complete: false,
        error: 'Có lỗi xảy ra khi chuẩn bị dữ liệu xuất',
      });
    }
  };

  // Format data for CSV export
  const formatCsvData = () => {
    if (!exportStatus.complete) return [];
    
    let csvData = [];
    
    // Add metadata
    csvData.push(['NatureGrain - Báo cáo Phân tích']);
    csvData.push([`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`]);
    csvData.push([`Phạm vi dữ liệu: ${dateRangeOptions.find(option => option.id === exportOptions.dateRange)?.name || '30 ngày qua'}`]);
    csvData.push([' ']); // Empty row for spacing
    
    // Basic Analytics
    if (exportOptions.includeBasicAnalytics && exportData.salesTrends) {
      csvData.push(['PHÂN TÍCH DOANH SỐ']);
      csvData.push(['Ngày', 'Doanh thu', 'Số đơn hàng', 'Giá trị đơn hàng trung bình']);
      
      exportData.salesTrends.data.forEach(item => {
        csvData.push([
          item.date,
          item.revenue,
          item.orderCount,
          item.averageOrderValue
        ]);
      });
      
      csvData.push([' ']); // Empty row for spacing
    }
    
    // RFM Analysis
    if (exportOptions.includeRfmAnalysis && exportData.rfmAnalysis) {
      csvData.push(['PHÂN TÍCH RFM KHÁCH HÀNG']);
      csvData.push(['Khách hàng', 'Phân khúc', 'Recency (Ngày)', 'Frequency (Đơn)', 'Monetary (VND)', 'R Score', 'F Score', 'M Score']);
      
      exportData.rfmAnalysis.customers.forEach(customer => {
        csvData.push([
          customer.username,
          customer.segment,
          customer.recencyDays,
          customer.frequency,
          customer.monetaryValue,
          customer.rScore,
          customer.fScore,
          customer.mScore
        ]);
      });
      
      csvData.push([' ']); // Empty row for spacing
      csvData.push(['Phân phối phân khúc']);
      csvData.push(['Phân khúc', 'Số lượng khách hàng']);
      
      Object.entries(exportData.rfmAnalysis.segmentCounts).forEach(([segment, count]) => {
        csvData.push([segment, count]);
      });
      
      csvData.push([' ']); // Empty row for spacing
    }
    
    // CLV Analysis
    if (exportOptions.includeClvAnalysis && exportData.clvAnalysis) {
      csvData.push(['PHÂN TÍCH GIÁ TRỊ VÒNG ĐỜI KHÁCH HÀNG (CLV)']);
      csvData.push(['Khách hàng', 'Số đơn hàng', 'Tổng chi tiêu', 'Giá trị đơn hàng TB', 'CLV', 'Giá trị hàng tháng']);
      
      exportData.clvAnalysis.customers.forEach(customer => {
        csvData.push([
          customer.username,
          customer.orderCount,
          customer.totalSpent,
          customer.avgOrderValue,
          customer.clv,
          customer.monthlyValue
        ]);
      });
      
      csvData.push([' ']); // Empty row for spacing
    }
    
    return csvData;
  };

  // If modal is closed, reset state
  useEffect(() => {
    if (!isOpen) {
      setExportStatus({
        loading: false,
        progress: 0,
        complete: false,
        error: null,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Xuất Báo cáo Phân tích
                  </h3>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {!exportStatus.complete ? (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Chọn các loại dữ liệu muốn xuất và phạm vi thời gian
                    </p>
                    
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phạm vi thời gian</label>
                        <select
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={exportOptions.dateRange}
                          onChange={handleDateRangeChange}
                        >
                          {dateRangeOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Loại dữ liệu</label>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center">
                            <input
                              id="basic-analytics"
                              name="basic-analytics"
                              type="checkbox"
                              checked={exportOptions.includeBasicAnalytics}
                              onChange={() => handleOptionChange('includeBasicAnalytics')}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="basic-analytics" className="ml-2 text-sm text-gray-700">
                              Phân tích cơ bản (Doanh số, Sản phẩm, Khách hàng)
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="rfm-analysis"
                              name="rfm-analysis"
                              type="checkbox"
                              checked={exportOptions.includeRfmAnalysis}
                              onChange={() => handleOptionChange('includeRfmAnalysis')}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="rfm-analysis" className="ml-2 text-sm text-gray-700">
                              Phân tích RFM
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="basket-analysis"
                              name="basket-analysis"
                              type="checkbox"
                              checked={exportOptions.includeBasketAnalysis}
                              onChange={() => handleOptionChange('includeBasketAnalysis')}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="basket-analysis" className="ml-2 text-sm text-gray-700">
                              Phân tích Giỏ hàng
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="cohort-analysis"
                              name="cohort-analysis"
                              type="checkbox"
                              checked={exportOptions.includeCohortAnalysis}
                              onChange={() => handleOptionChange('includeCohortAnalysis')}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="cohort-analysis" className="ml-2 text-sm text-gray-700">
                              Phân tích Đoàn hệ
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="clv-analysis"
                              name="clv-analysis"
                              type="checkbox"
                              checked={exportOptions.includeClvAnalysis}
                              onChange={() => handleOptionChange('includeClvAnalysis')}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="clv-analysis" className="ml-2 text-sm text-gray-700">
                              Phân tích Giá trị Vòng đời Khách hàng
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="flex items-center justify-center py-4">
                      <CheckCircleIcon className="h-10 w-10 text-green-500" />
                    </div>
                    <p className="text-center text-green-600 font-medium">
                      Dữ liệu báo cáo đã sẵn sàng để tải xuống
                    </p>
                  </div>
                )}
                
                {exportStatus.loading && (
                  <div className="mt-4">
                    <div className="flex items-center justify-center mb-2">
                      <ClockIcon className="animate-spin h-6 w-6 text-indigo-500" />
                    </div>
                    <p className="text-center text-sm text-gray-600">
                      Đang chuẩn bị dữ liệu ({exportStatus.progress}%)...
                    </p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${exportStatus.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {exportStatus.error && (
                  <div className="mt-4">
                    <div className="flex items-center justify-center text-red-500">
                      <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                      <p className="text-sm">{exportStatus.error}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {!exportStatus.complete ? (
              <button
                type="button"
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                  exportStatus.loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={prepareExport}
                disabled={exportStatus.loading}
              >
                {exportStatus.loading ? 'Đang xử lý...' : 'Chuẩn bị dữ liệu'}
              </button>
            ) : (
              <CSVLink
                data={formatCsvData()}
                filename={generateExportFilename()}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Tải xuống báo cáo
              </CSVLink>
            )}
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              {exportStatus.complete ? 'Đóng' : 'Hủy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportAnalyticsReportModal;
