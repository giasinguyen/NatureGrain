import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  XMarkIcon, 
  AdjustmentsHorizontalIcon, 
  FunnelIcon
} from '@heroicons/react/24/outline';

export default function ProductFilter({ categories, onApplyFilters }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  useEffect(() => {
    // Cập nhật filters khi URL thay đổi
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || 'newest';
    
    setFilters({ category, minPrice, maxPrice, sort });
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    // Xóa các filter có giá trị rỗng
    const newParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });
    
    setSearchParams(newParams);
    onApplyFilters(filters);
    
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    });
    setSearchParams({});
    onApplyFilters({});
  };

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'price_asc', label: 'Giá: Thấp đến cao' },
    { value: 'price_desc', label: 'Giá: Cao đến thấp' },
    { value: 'name_asc', label: 'Tên: A-Z' },
    { value: 'name_desc', label: 'Tên: Z-A' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Mobile filter button */}
      <div className="md:hidden p-4 border-b border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full"
        >
          <span className="font-medium flex items-center">
            <FunnelIcon className="w-5 h-5 mr-2" />
            Bộ lọc sản phẩm
          </span>
          {isOpen ? (
            <XMarkIcon className="w-5 h-5" />
          ) : (
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Filter content */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block p-4`}>
        <h3 className="font-medium text-lg mb-4 hidden md:block">Bộ lọc sản phẩm</h3>

        {/* Category filter */}
        <div className="mb-6">
          <h4 className="font-medium text-sm mb-2">Danh mục</h4>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price range filter */}
        <div className="mb-6">
          <h4 className="font-medium text-sm mb-2">Khoảng giá</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="minPrice" className="sr-only">
                Giá từ
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                placeholder="Giá từ"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="sr-only">
                Đến
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="Đến"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Sort filter */}
        <div className="mb-6">
          <h4 className="font-medium text-sm mb-2">Sắp xếp theo</h4>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleResetFilters}
            className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Xóa bộ lọc
          </button>
          <button
            onClick={handleApplyFilters}
            className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}