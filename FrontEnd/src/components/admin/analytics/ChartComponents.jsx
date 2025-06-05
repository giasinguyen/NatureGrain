import React, { memo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Modern color schemes
const COLORS = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    900: '#14532d'
  },
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  },
  accent: {
    50: '#fefce8',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309'
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c'
  }
};

// Chart Options with enhanced interactivity
const getChartOptions = (title, isDark = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: isDark ? '#d1d5db' : '#374151',
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: 'medium'
        }
      }
    },
    title: {
      display: title ? true : false,
      text: title,
      color: isDark ? '#f9fafb' : '#111827',
      font: {
        size: 16,
        weight: 'bold'
      },
      padding: {
        top: 10,
        bottom: 30
      }
    },
    tooltip: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      titleColor: isDark ? '#f9fafb' : '#111827',
      bodyColor: isDark ? '#d1d5db' : '#374151',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 12
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: isDark ? '#374151' : '#f3f4f6',
        drawBorder: false
      },
      ticks: {
        color: isDark ? '#9ca3af' : '#6b7280',
        font: {
          size: 11
        }
      }
    },
    y: {
      grid: {
        color: isDark ? '#374151' : '#f3f4f6',
        drawBorder: false
      },
      ticks: {
        color: isDark ? '#9ca3af' : '#6b7280',
        font: {
          size: 11
        }
      }
    }
  },
  elements: {
    point: {
      hoverRadius: 8,
      radius: 4
    },
    line: {
      borderWidth: 2
    }
  }
});

// Line Chart Component
const LineChartComponent = memo(({ data, title, darkMode }) => {
  return (
    <div className="h-80">
      <Line
        data={data}
        options={getChartOptions(title, darkMode)}
      />
    </div>
  );
});

// Bar Chart Component
const BarChartComponent = memo(({ data, title, darkMode }) => {
  return (
    <div className="h-80">
      <Bar
        data={data}
        options={{
          ...getChartOptions(title, darkMode),
          scales: {
            ...getChartOptions('', darkMode).scales,
            y: {
              ...getChartOptions('', darkMode).scales.y,
              beginAtZero: true
            }
          }
        }}
      />
    </div>
  );
});

// Doughnut Chart Component
const DoughnutChartComponent = memo(({ data, title, darkMode }) => {
  return (
    <div className="h-80">
      <Doughnut
        data={data}
        options={{
          ...getChartOptions(title, darkMode),
          cutout: '60%',
          plugins: {
            ...getChartOptions('', darkMode).plugins,
            legend: {
              ...getChartOptions('', darkMode).plugins.legend,
              position: 'bottom'
            }
          }
        }}
      />
    </div>
  );
});

// Pie Chart Component
const PieChartComponent = memo(({ data, title, darkMode }) => {
  return (
    <div className="h-80">
      <Pie
        data={data}
        options={getChartOptions(title, darkMode)}
      />
    </div>
  );
});

LineChartComponent.displayName = 'LineChartComponent';
BarChartComponent.displayName = 'BarChartComponent';
DoughnutChartComponent.displayName = 'DoughnutChartComponent';
PieChartComponent.displayName = 'PieChartComponent';

export {
  LineChartComponent,
  BarChartComponent,
  DoughnutChartComponent,
  PieChartComponent,
  COLORS,
  getChartOptions
};
