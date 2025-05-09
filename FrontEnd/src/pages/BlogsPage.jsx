import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  CalendarIcon, 
  UserCircleIcon,
  MagnifyingGlassIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Pagination from '../components/ui/Pagination';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 6;
  
  // Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  
  // Mock data for development until backend is fully connected
  const mockBlogs = [
    {
      id: 1,
      title: 'Lợi ích sức khỏe của gạo lứt và cách nấu gạo lứt ngon',
      description: 'Tìm hiểu về những lợi ích tuyệt vời của gạo lứt đối với sức khỏe và các mẹo nấu gạo lứt ngon, dẻo như gạo trắng.',
      content: 'Nội dung chi tiết về gạo lứt...',
      createAt: '2025-04-15T10:30:00',
      image: {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      },
      user: {
        name: 'Minh Thành',
        username: 'minhthanh'
      },
      tags: [
        { id: 1, name: 'Sức khỏe' },
        { id: 2, name: 'Gạo lứt' }
      ]
    },
    {
      id: 2,
      title: '5 công thức làm bánh từ bột mì nguyên cám cho người ăn kiêng',
      description: 'Những công thức làm bánh lành mạnh từ bột mì nguyên cám giàu dinh dưỡng và thích hợp cho người đang ăn kiêng.',
      content: 'Nội dung chi tiết về các công thức bánh...',
      createAt: '2025-04-10T14:20:00',
      image: {
        url: 'https://images.unsplash.com/photo-1606101273945-e9eba91c0dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      },
      user: {
        name: 'Thu Hương',
        username: 'thuhuong'
      },
      tags: [
        { id: 3, name: 'Công thức' },
        { id: 4, name: 'Bánh mì' },
        { id: 5, name: 'Ăn kiêng' }
      ]
    },
    {
      id: 3,
      title: 'Giới thiệu các loại hạt dinh dưỡng tốt cho sức khỏe tim mạch',
      description: 'Các loại hạt dinh dưỡng không chỉ là nguồn cung cấp protein thực vật tuyệt vời mà còn rất tốt cho sức khỏe tim mạch.',
      content: 'Nội dung chi tiết về hạt dinh dưỡng...',
      createAt: '2025-04-05T09:15:00',
      image: {
        url: 'https://images.unsplash.com/photo-1545634337-35a2734dbe2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      },
      user: {
        name: 'Văn Tuấn',
        username: 'vantuan'
      },
      tags: [
        { id: 1, name: 'Sức khỏe' },
        { id: 6, name: 'Hạt dinh dưỡng' },
        { id: 7, name: 'Tim mạch' }
      ]
    },
    {
      id: 4,
      title: 'Cách làm sữa hạt tại nhà đơn giản và bổ dưỡng',
      description: 'Hướng dẫn chi tiết cách làm các loại sữa hạt tại nhà từ hạnh nhân, óc chó, đậu nành và các loại hạt khác.',
      content: 'Nội dung chi tiết về cách làm sữa hạt...',
      createAt: '2025-04-01T11:45:00',
      image: {
        url: 'https://images.unsplash.com/photo-1601390395693-364c0341a90d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80'
      },
      user: {
        name: 'Ngọc Linh',
        username: 'ngoclinh'
      },
      tags: [
        { id: 3, name: 'Công thức' },
        { id: 6, name: 'Hạt dinh dưỡng' },
        { id: 8, name: 'Sữa thực vật' }
      ]
    },
    {
      id: 5,
      title: 'Hướng dẫn chọn và bảo quản rau củ hữu cơ',
      description: 'Mẹo chọn lựa rau củ hữu cơ tươi ngon và các phương pháp bảo quản để giữ nguyên giá trị dinh dưỡng.',
      content: 'Nội dung chi tiết về bảo quản rau củ...',
      createAt: '2025-03-28T13:10:00',
      image: {
        url: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80'
      },
      user: {
        name: 'Minh Thành',
        username: 'minhthanh'
      },
      tags: [
        { id: 9, name: 'Rau củ hữu cơ' },
        { id: 10, name: 'Mẹo hữu ích' }
      ]
    },
    {
      id: 6,
      title: 'Thực đơn ăn sạch 7 ngày cho người bận rộn',
      description: 'Gợi ý thực đơn ăn sạch trong một tuần dành cho những người bận rộn nhưng vẫn muốn duy trì chế độ ăn lành mạnh.',
      content: 'Nội dung chi tiết về thực đơn ăn sạch...',
      createAt: '2025-03-25T16:30:00',
      image: {
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80'
      },
      user: {
        name: 'Thu Hương',
        username: 'thuhuong'
      },
      tags: [
        { id: 1, name: 'Sức khỏe' },
        { id: 11, name: 'Ăn sạch' },
        { id: 12, name: 'Thực đơn' }
      ]
    }
  ];
  
  // Get all available tags from blogs
  const allTags = [...new Set(mockBlogs.flatMap(blog => blog.tags.map(tag => tag.name)))];
  const [selectedTag, setSelectedTag] = useState('');
  
  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await blogService.getBlogs();
        
        if (response && response.data) {
          console.log('Blogs data from API:', response.data);
          setBlogs(response.data);
        } else {
          console.warn('API returned no data, using mock data instead');
          setBlogs(mockBlogs);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
        // Use mock data as fallback
        setBlogs(mockBlogs);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);
  
  // Filter blogs based on search term and selected tag
  useEffect(() => {
    let filtered = blogs;
    
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedTag) {
      filtered = filtered.filter(blog => 
        blog.tags.some(tag => tag.name === selectedTag)
      );
    }
    
    setFilteredBlogs(filtered);
    setTotalPages(Math.ceil(filtered.length / postsPerPage));
    setCurrentPage(1); // Reset to first page on filter change
  }, [blogs, searchTerm, selectedTag]);
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'd MMMM, yyyy', { locale: vi });
    } catch (error) {
      return 'Không có ngày';
    }
  };
  
  // Calculate current blogs to display based on pagination
  const getCurrentBlogs = () => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);
  };
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle tag selection
  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Tin Tức & Kiến Thức</h1>
          <p className="max-w-2xl mx-auto text-lg">
            Khám phá các bài viết bổ ích về thực phẩm hữu cơ, dinh dưỡng và lối sống lành mạnh
            từ các chuyên gia của NatureGrain.
          </p>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              
              {/* Tag Filter */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full md:w-auto">
                {allTags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 transition-colors ${
                      selectedTag === tag 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <TagIcon className="h-3 w-3" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 p-4 rounded-md mb-8 text-red-700 text-center">
              {error}
            </div>
          )}
          
          {/* No Results */}
          {!loading && filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">Không tìm thấy bài viết nào phù hợp.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('');
                }} 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
          
          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {getCurrentBlogs().map(blog => (
              <div key={blog.id} className="bg-white rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                {/* Blog Image */}
                <Link to={`/blog/${blog.id}`} className="block aspect-video overflow-hidden">
                  {blog.image ? (
                    <img 
                      src={blog.image.url} 
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sem imagem</span>
                    </div>
                  )}
                </Link>
                
                {/* Blog Content */}
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {blog.tags && blog.tags.length > 0 ? (
                      <>
                        {blog.tags.slice(0, 2).map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {blog.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{blog.tags.length - 2}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">Sem tags</span>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h2 className="font-bold text-xl mb-3 line-clamp-2">
                    <Link 
                      to={`/blog/${blog.id}`} 
                      className="text-gray-800 hover:text-green-600 transition-colors"
                    >
                      {blog.title}
                    </Link>
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.description}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <UserCircleIcon className="h-4 w-4" />
                      <span>{blog.user ? blog.user.name : 'Autor desconhecido'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatDate(blog.createAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {filteredBlogs.length > postsPerPage && (
            <div className="flex justify-center">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogsPage;