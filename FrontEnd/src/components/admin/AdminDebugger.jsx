import { useLocation } from 'react-router-dom';

const AdminDebugger = () => {
  const location = useLocation();

  // Thông tin hiện tại
  const currentPath = location.pathname;
  const currentSearch = location.search;
  const currentHash = location.hash;

  return (
    <div className="p-4 mb-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-lg font-medium mb-2">Debug Admin Routing</h2>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-700 p-2 rounded">
          <span className="text-gray-300 text-sm">Current Path:</span>
          <div className="font-mono text-green-400">{currentPath}</div>
        </div>
        
        <div className="bg-gray-700 p-2 rounded">
          <span className="text-gray-300 text-sm">URL Parameters:</span>
          <div className="font-mono text-green-400">
            {currentSearch ? currentSearch : 'None'}
          </div>
        </div>
        
        <div className="bg-gray-700 p-2 rounded">
          <span className="text-gray-300 text-sm">Hash:</span>
          <div className="font-mono text-green-400">
            {currentHash ? currentHash : 'None'}
          </div>
        </div>
        
        <div className="bg-gray-700 p-2 rounded">
          <span className="text-gray-300 text-sm">Admin Route Match:</span>
          <div className="font-mono text-green-400">
            {currentPath.startsWith('/admin') ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
      
      <details className="mt-2">
        <summary className="text-sm text-gray-300 cursor-pointer">View Router Tree</summary>
        <pre className="bg-gray-700 p-2 mt-2 rounded text-xs text-gray-200 overflow-auto max-h-48">
{`
/admin
├── / (AdminDashboard)
├── products (ProductsManagement)
├── categories (CategoriesManagement)
├── orders (OrdersManagement)
└── * (404 - redirect to /admin)
`}
        </pre>
      </details>
    </div>
  );
};

export default AdminDebugger;
