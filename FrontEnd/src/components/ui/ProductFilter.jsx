import { useState, useEffect } from 'react';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProductFilter = ({ 
  categories = [], 
  priceRanges = [],
  selectedFilters = {},
  onFilterChange,
  isMobileFilterOpen,
  setIsMobileFilterOpen
}) => {
  // State cho các bộ lọc
  const [filters, setFilters] = useState({
    category: selectedFilters.category || '',
    priceRange: selectedFilters.priceRange || '',
    sort: selectedFilters.sort || 'newest',
    inStock: selectedFilters.inStock || false,
    isOrganic: selectedFilters.isOrganic || false,
  });

  // Cập nhật state khi selectedFilters thay đổi
  useEffect(() => {
    // Compare current filters with selectedFilters to prevent infinite loop
    const needsUpdate = Object.keys(selectedFilters).some(key => 
      selectedFilters[key] !== filters[key]
    );
    
    if (needsUpdate) {
      setFilters(prevFilters => ({
        ...prevFilters,
        ...selectedFilters
      }));
    }
  }, [selectedFilters]);

  // Giá trị sắp xếp
  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá tăng dần' },
    { value: 'price-desc', label: 'Giá giảm dần' },
    { value: 'name-asc', label: 'Tên A-Z' },
    { value: 'name-desc', label: 'Tên Z-A' },
    { value: 'popular', label: 'Phổ biến nhất' }
  ];

  // Xử lý khi thay đổi giá trị bộ lọc
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Xử lý reset bộ lọc
  const handleResetFilters = () => {
    const defaultFilters = {
      category: '',
      priceRange: '',
      sort: 'newest',
      inStock: false,
      isOrganic: false
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  // Kiểm tra nút reset có hiển thị hay không
  const hasActiveFilters = 
    filters.category || 
    filters.priceRange || 
    filters.sort !== 'newest' ||
    filters.inStock || 
    filters.isOrganic;

  return (
    <>
      {/* Mobile filter dialog */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50">
          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <div className="w-full max-w-xs bg-white shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-lg font-medium">Bộ lọc</h2>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-gray-500"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-full">
                {/* Mobile filter content */}
                <div className="space-y-6">
                  {/* Danh mục */}
                  {categories.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">Danh mục</h3>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <input
                            id="category-all-mobile"
                            type="radio"
                            name="category-mobile"
                            value=""
                            checked={!filters.category}
                            onChange={() => handleFilterChange('category', '')}
                            className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <label htmlFor="category-all-mobile" className="ml-2 text-gray-600">
                            Tất cả
                          </label>
                        </div>
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <input
                              id={`category-${category.id}-mobile`}
                              type="radio"
                              name="category-mobile"
                              value={category.id}
                              checked={filters.category === category.id}
                              onChange={() => handleFilterChange('category', category.id)}
                              className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor={`category-${category.id}-mobile`} className="ml-2 text-gray-600">
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Khoảng giá */}
                  {priceRanges.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">Khoảng giá</h3>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <input
                            id="price-all-mobile"
                            type="radio"
                            name="price-mobile"
                            value=""
                            checked={!filters.priceRange}
                            onChange={() => handleFilterChange('priceRange', '')}
                            className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <label htmlFor="price-all-mobile" className="ml-2 text-gray-600">
                            Tất cả mức giá
                          </label>
                        </div>
                        {priceRanges.map((range) => (
                          <div key={range.value} className="flex items-center">
                            <input
                              id={`price-${range.value}-mobile`}
                              type="radio"
                              name="price-mobile"
                              value={range.value}
                              checked={filters.priceRange === range.value}
                              onChange={() => handleFilterChange('priceRange', range.value)}
                              className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor={`price-${range.value}-mobile`} className="ml-2 text-gray-600">
                              {range.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hàng sẵn có */}
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-2">Tình trạng</h3>
                    <div className="flex items-center">
                      <input
                        id="instock-mobile"
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={() => handleFilterChange('inStock', !filters.inStock)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="instock-mobile" className="ml-2 text-gray-600">
                        Còn hàng
                      </label>
                    </div>
                  </div>

                  {/* Sản phẩm hữu cơ */}
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-2">Loại</h3>
                    <div className="flex items-center">
                      <input
                        id="organic-mobile"
                        type="checkbox"
                        checked={filters.isOrganic}
                        onChange={() => handleFilterChange('isOrganic', !filters.isOrganic)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="organic-mobile" className="ml-2 text-gray-600">
                        Sản phẩm hữu cơ
                      </label>
                    </div>
                  </div>
                </div>

                {/* Mobile footer buttons */}
                <div className="border-t border-gray-200 px-4 py-3 mt-6">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="text-sm font-medium text-gray-700 hover:text-gray-500"
                      onClick={handleResetFilters}
                    >
                      Xóa bộ lọc
                    </button>
                    <button
                      type="button"
                      className="ml-3 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                      onClick={() => setIsMobileFilterOpen(false)}
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop filter sidebar */}
      <div className="hidden lg:block">
        <div className="space-y-6">
          {/* Filter title */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Bộ lọc
            </h2>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Các danh mục */}
          {categories.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-md font-medium text-gray-800 mb-2">Danh mục</h3>
              <div className="space-y-1">
                <div className="flex items-center">
                  <input
                    id="category-all"
                    type="radio"
                    name="category"
                    value=""
                    checked={!filters.category}
                    onChange={() => handleFilterChange('category', '')}
                    className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="category-all" className="ml-2 text-gray-600">
                    Tất cả
                  </label>
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={`category-${category.id}`}
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={filters.category === category.id}
                      onChange={() => handleFilterChange('category', category.id)}
                      className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-600">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Khoảng giá */}
          {priceRanges.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-md font-medium text-gray-800 mb-2">Khoảng giá</h3>
              <div className="space-y-1">
                <div className="flex items-center">
                  <input
                    id="price-all"
                    type="radio"
                    name="price"
                    value=""
                    checked={!filters.priceRange}
                    onChange={() => handleFilterChange('priceRange', '')}
                    className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="price-all" className="ml-2 text-gray-600">
                    Tất cả mức giá
                  </label>
                </div>
                {priceRanges.map((range) => (
                  <div key={range.value} className="flex items-center">
                    <input
                      id={`price-${range.value}`}
                      type="radio"
                      name="price"
                      value={range.value}
                      checked={filters.priceRange === range.value}
                      onChange={() => handleFilterChange('priceRange', range.value)}
                      className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor={`price-${range.value}`} className="ml-2 text-gray-600">
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hàng sẵn có */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">Tình trạng</h3>
            <div className="flex items-center">
              <input
                id="instock"
                type="checkbox"
                checked={filters.inStock}
                onChange={() => handleFilterChange('inStock', !filters.inStock)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="instock" className="ml-2 text-gray-600">
                Còn hàng
              </label>
            </div>
          </div>

          {/* Sản phẩm hữu cơ */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">Loại</h3>
            <div className="flex items-center">
              <input
                id="organic"
                type="checkbox"
                checked={filters.isOrganic}
                onChange={() => handleFilterChange('isOrganic', !filters.isOrganic)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="organic" className="ml-2 text-gray-600">
                Sản phẩm hữu cơ
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sort options - for both mobile and desktop */}
      <div className="bg-white p-4 shadow-sm rounded-md mt-6 lg:mt-0">
        <div className="flex items-center justify-between">
          <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700">
            Sắp xếp theo
          </label>
          <select
            id="sort-by"
            name="sort-by"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default ProductFilter;