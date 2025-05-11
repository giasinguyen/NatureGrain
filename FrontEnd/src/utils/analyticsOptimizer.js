/**
 * Utility functions for optimizing analytics data processing and visualization
 */

/**
 * Optimizes large datasets for better chart rendering performance
 * @param {Array} data - The original dataset
 * @param {number} maxDataPoints - Maximum number of data points to display
 * @param {string} aggregationType - Type of aggregation ('sum', 'average')
 * @returns {Array} - The optimized dataset
 */
export const optimizeDataset = (data, maxDataPoints = 50, aggregationType = 'sum') => {
  if (!data || data.length === 0) return [];
  
  // If data is already small enough, return as is
  if (data.length <= maxDataPoints) return data;
  
  // Calculate how many points to combine
  const aggregationFactor = Math.ceil(data.length / maxDataPoints);
  const result = [];
  
  // Group and aggregate data
  for (let i = 0; i < data.length; i += aggregationFactor) {
    const chunk = data.slice(i, i + aggregationFactor);
    const aggregated = {};
    
    // Copy non-numeric properties from the first item
    Object.keys(chunk[0]).forEach(key => {
      if (typeof chunk[0][key] !== 'number') {
        aggregated[key] = i === 0 ? chunk[0][key] : 
          `${chunk[0][key]}${chunk.length > 1 ? ` - ${chunk[chunk.length - 1][key]}` : ''}`;
      }
    });
    
    // Aggregate numeric values
    Object.keys(chunk[0]).forEach(key => {
      if (typeof chunk[0][key] === 'number') {
        if (aggregationType === 'average') {
          aggregated[key] = chunk.reduce((sum, item) => sum + item[key], 0) / chunk.length;
        } else {
          aggregated[key] = chunk.reduce((sum, item) => sum + item[key], 0);
        }
      }
    });
    
    result.push(aggregated);
  }
  
  return result;
};

/**
 * Processes time series data with efficient date handling
 * @param {Array} data - Time series data
 * @param {string} dateField - Name of the date field
 * @param {string} valueField - Name of the value field
 * @returns {Array} - Processed data ready for visualization
 */
export const processTimeSeriesData = (data, dateField, valueField) => {
  if (!data || data.length === 0) return [];
  
  // Sort by date
  const sorted = [...data].sort((a, b) => new Date(a[dateField]) - new Date(b[dateField]));
  
  // Format dates consistently and extract values
  return sorted.map(item => ({
    date: new Date(item[dateField]).toISOString().split('T')[0],
    value: item[valueField]
  }));
};

/**
 * Efficiently calculates summary statistics for a dataset
 * @param {Array} data - The dataset
 * @param {string} field - Field to calculate statistics for
 * @returns {Object} - Summary statistics
 */
export const calculateStatistics = (data, field) => {
  if (!data || data.length === 0) {
    return { min: 0, max: 0, average: 0, sum: 0, median: 0 };
  }
  
  const values = data.map(item => Number(item[field])).filter(v => !isNaN(v));
  
  if (values.length === 0) {
    return { min: 0, max: 0, average: 0, sum: 0, median: 0 };
  }
  
  values.sort((a, b) => a - b);
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  const min = values[0];
  const max = values[values.length - 1];
  const average = sum / values.length;
  const median = values.length % 2 === 0
    ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
    : values[Math.floor(values.length / 2)];
    
  return { min, max, average, sum, median };
};

/**
 * Memory-efficient function to format data for CSV export
 * @param {Array} data - The original dataset 
 * @param {Object} fieldMap - Mapping of original field names to export names
 * @returns {Array} - Formatted data for CSV export
 */
export const formatForCSVExport = (data, fieldMap) => {
  if (!data || data.length === 0) return [];
  
  return data.map(item => {
    const result = {};
    Object.entries(fieldMap).forEach(([original, formatted]) => {
      if (item[original] !== undefined) {
        result[formatted] = item[original];
      }
    });
    return result;
  });
};

/**
 * Lazy loads data for pagination or infinite scroll in data tables
 * @param {Array} data - The complete dataset
 * @param {number} page - Current page number (0-based)
 * @param {number} pageSize - Number of items per page
 * @returns {Array} - Paginated subset of data
 */
export const paginateData = (data, page = 0, pageSize = 10) => {
  if (!data || data.length === 0) return [];
  
  const start = page * pageSize;
  const end = start + pageSize;
  
  return data.slice(start, end);
};

/**
 * Efficiently filters large datasets
 * @param {Array} data - The dataset to filter
 * @param {Object} filters - Object with field-value pairs for filtering
 * @returns {Array} - Filtered dataset
 */
export const filterDataset = (data, filters) => {
  if (!data || data.length === 0 || !filters || Object.keys(filters).length === 0) {
    return data;
  }
  
  return data.filter(item => {
    return Object.entries(filters).every(([field, value]) => {
      // Skip undefined filters
      if (value === undefined || value === null || value === '') return true;
      
      // Handle range filters
      if (typeof value === 'object' && (value.min !== undefined || value.max !== undefined)) {
        const itemValue = Number(item[field]);
        if (isNaN(itemValue)) return false;
        
        if (value.min !== undefined && value.max !== undefined) {
          return itemValue >= value.min && itemValue <= value.max;
        } else if (value.min !== undefined) {
          return itemValue >= value.min;
        } else if (value.max !== undefined) {
          return itemValue <= value.max;
        }
        return true;
      }
      
      // Handle string values with case-insensitive contains
      if (typeof item[field] === 'string' && typeof value === 'string') {
        return item[field].toLowerCase().includes(value.toLowerCase());
      }
      
      // Default equality check
      return item[field] === value;
    });
  });
};

/**
 * Derives color scales for charts based on data characteristics
 * @param {Array} data - The dataset
 * @param {string} field - Field to base colors on
 * @param {Array} colorRange - Base colors to interpolate between
 * @returns {Function} - Function that returns a color for a data point
 */
export const createColorScale = (data, field, colorRange = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']) => {
  if (!data || data.length === 0) return () => colorRange[0];
  
  const values = data.map(item => Number(item[field])).filter(v => !isNaN(v));
  
  if (values.length === 0) return () => colorRange[0];
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  return (value) => {
    if (isNaN(value)) return colorRange[0];
    
    // Normalize value to 0-1 range
    const normalized = range === 0 ? 0 : (value - min) / range;
    
    // Find the right color segment
    const segmentSize = 1 / (colorRange.length - 1);
    const segment = Math.min(Math.floor(normalized / segmentSize), colorRange.length - 2);
    const segmentPosition = (normalized - segment * segmentSize) / segmentSize;
    
    // Simple linear interpolation between two colors
    const color1 = colorRange[segment];
    const color2 = colorRange[segment + 1];
    
    // Convert hex to rgb
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);
    
    // Interpolate
    const r = Math.round(r1 + segmentPosition * (r2 - r1));
    const g = Math.round(g1 + segmentPosition * (g2 - g1));
    const b = Math.round(b1 + segmentPosition * (b2 - b1));
    
    return `rgb(${r}, ${g}, ${b})`;
  };
};
