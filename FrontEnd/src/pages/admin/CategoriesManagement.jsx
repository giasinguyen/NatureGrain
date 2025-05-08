import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  PlusIcon, PencilIcon as PencilAltIcon, TrashIcon, XCircleIcon,
  CheckCircleIcon, XMarkIcon as XIcon
} from '@heroicons/react/24/outline';
import { categoryService } from '../../services/api';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };
  
  // Open modal to add new category
  const handleAddNew = () => {
    setCurrentCategory(null);
    setCategoryName('');
    setShowModal(true);
  };
  
  // Open modal to edit category
  const handleEdit = (category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setShowModal(true);
  };
  
  // Handle category form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast.error('Tên danh mục không được để trống');
      return;
    }
    
    try {
      setLoading(true);
      
      if (currentCategory) {
        // Update existing category
        await categoryService.updateCategory(currentCategory.id, { name: categoryName });
        toast.success('Cập nhật danh mục thành công');
      } else {
        // Create new category
        await categoryService.createCategory({ name: categoryName });
        toast.success('Tạo danh mục mới thành công');
      }
      
      // Refresh categories list
      fetchCategories();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Không thể lưu danh mục. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle category deletion
  const handleDelete = async (category) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      try {
        setLoading(true);
        await categoryService.deleteCategory(category.id);
        toast.success('Xóa danh mục thành công');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Không thể xóa danh mục. Có thể danh mục này đang được sử dụng bởi các sản phẩm.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Toggle category status (enable/disable)
  const handleToggleStatus = async (category) => {
    try {
      setLoading(true);
      await categoryService.enableCategory(category.id);
      toast.success(`Danh mục đã được ${category.enable ? 'vô hiệu hóa' : 'kích hoạt'}`);
      fetchCategories();
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast.error('Không thể thay đổi trạng thái danh mục');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý Danh mục</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Thêm danh mục mới
        </button>
      </div>
      
      {/* Categories Table */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Tên danh mục
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Trạng thái
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-sm text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
                    <span className="ml-2">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-sm text-center text-gray-500">
                  Chưa có danh mục nào
                </td>
              </tr>
            ) : (
              categories.map(category => (
                <tr key={category.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">#{category.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${
                        category.enable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {category.enable ? 'Đang kích hoạt' : 'Vô hiệu hóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(category)}
                      className={`inline-flex items-center px-2 py-1 mr-2 text-sm ${
                        category.enable
                          ? 'text-red-600 hover:text-red-800'
                          : 'text-green-600 hover:text-green-800'
                      }`}
                      title={category.enable ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    >
                      {category.enable ? (
                        <XIcon className="w-4 h-4 mr-1" />
                      ) : (
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                      )}
                      {category.enable ? 'Vô hiệu' : 'Kích hoạt'}
                    </button>
                    <button
                      onClick={() => handleEdit(category)}
                      className="inline-flex items-center px-2 py-1 mr-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <PencilAltIcon className="w-4 h-4 mr-1" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="inline-flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative w-full max-w-md mx-auto my-6">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold">
                  {currentCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowModal(false)}
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Tên danh mục
                    </label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      placeholder="Nhập tên danh mục"
                    />
                  </div>
                </div>
                <div className="flex justify-end p-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 mr-3 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu danh mục'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;