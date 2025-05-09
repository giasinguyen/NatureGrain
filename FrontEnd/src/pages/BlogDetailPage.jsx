import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../services/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  UserCircleIcon,
  CalendarIcon,
  ArrowLeftIcon,
  ShareIcon,
  TagIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for related blogs
  const mockRelatedBlogs = [
    {
      id: 2,
      title: '5 công thức làm bánh từ bột mì nguyên cám cho người ăn kiêng',
      createAt: '2025-04-10T14:20:00',
      image: {
        url: 'https://images.unsplash.com/photo-1606101273945-e9eba91c0dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      }
    },
    {
      id: 3,
      title: 'Giới thiệu các loại hạt dinh dưỡng tốt cho sức khỏe tim mạch',
      createAt: '2025-04-05T09:15:00',
      image: {
        url: 'https://images.unsplash.com/photo-1545634337-35a2734dbe2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      }
    },
    {
      id: 4,
      title: 'Cách làm sữa hạt tại nhà đơn giản và bổ dưỡng',
      createAt: '2025-04-01T11:45:00',
      image: {
        url: 'https://images.unsplash.com/photo-1601390395693-364c0341a90d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80'
      }
    }
  ];

  // Mock blog data
  const mockBlog = {
    id: 1,
    title: 'Lợi ích sức khỏe của gạo lứt và cách nấu gạo lứt ngon',
    description: 'Tìm hiểu về những lợi ích tuyệt vời của gạo lứt đối với sức khỏe và các mẹo nấu gạo lứt ngon, dẻo như gạo trắng.',
    content: `<p>Gạo lứt là một loại gạo chưa qua xay xát hoặc chỉ xay sơ qua lớp vỏ trấu bên ngoài, giữ lại lớp cám (vỏ lụa), mầm và nội nhũ (phần tinh bột bên trong). Nhờ vậy, gạo lứt giữ được nhiều chất dinh dưỡng hơn so với gạo trắng đã qua xay xát kỹ.</p>

    <h2>Lợi ích sức khỏe của gạo lứt</h2>
    
    <p>Dưới đây là những lợi ích tuyệt vời mà gạo lứt mang lại cho sức khỏe:</p>
    
    <h3>1. Giàu chất xơ và chất dinh dưỡng</h3>
    
    <p>Gạo lứt chứa nhiều chất xơ hơn gạo trắng, giúp cải thiện tiêu hóa và tạo cảm giác no lâu. Ngoài ra, gạo lứt còn chứa nhiều vitamin nhóm B (B1, B3, B6), sắt, kẽm, magie, phốt pho và mangan.</p>
    
    <h3>2. Kiểm soát đường huyết tốt hơn</h3>
    
    <p>Chỉ số đường huyết (GI) của gạo lứt thấp hơn so với gạo trắng, giúp giảm đáng kể đột biến đường huyết sau khi ăn. Điều này đặc biệt có lợi cho người mắc bệnh tiểu đường hoặc có nguy cơ mắc bệnh tiểu đường.</p>
    
    <h3>3. Hỗ trợ giảm cân</h3>
    
    <p>Với hàm lượng chất xơ cao và chỉ số đường huyết thấp, gạo lứt giúp bạn cảm thấy no lâu hơn, từ đó giảm lượng thức ăn nạp vào cơ thể, hỗ trợ quá trình giảm cân hiệu quả.</p>
    
    <h3>4. Tốt cho sức khỏe tim mạch</h3>
    
    <p>Gạo lứt chứa nhiều chất chống oxy hóa và các hợp chất thực vật có lợi, giúp giảm cholesterol xấu LDL và tăng cholesterol tốt HDL, từ đó giảm nguy cơ mắc các bệnh tim mạch.</p>
    
    <h3>5. Bảo vệ cơ thể khỏi các gốc tự do</h3>
    
    <p>Gạo lứt chứa nhiều chất chống oxy hóa giúp bảo vệ tế bào khỏi tác hại của các gốc tự do, làm chậm quá trình lão hóa và giảm nguy cơ mắc các bệnh mãn tính.</p>
    
    <h2>Cách nấu gạo lứt ngon và dẻo</h2>
    
    <p>Nhiều người ngại ăn gạo lứt vì khó nấu chín, cứng và nhạt. Dưới đây là cách nấu gạo lứt ngon, dẻo và dễ ăn hơn:</p>
    
    <h3>Phương pháp 1: Ngâm gạo lứt trước khi nấu</h3>
    
    <ol>
      <li>Rửa sạch gạo lứt dưới vòi nước chảy.</li>
      <li>Ngâm gạo lứt trong nước ấm (khoảng 30-35°C) từ 6-8 giờ, hoặc tốt nhất là qua đêm. Quá trình ngâm sẽ kích hoạt enzym giúp gạo mềm hơn khi nấu.</li>
      <li>Sau khi ngâm, đổ nước ngâm đi và rửa lại gạo một lần nữa.</li>
      <li>Cho gạo vào nồi cơm điện với tỷ lệ 1:2 (1 phần gạo, 2 phần nước).</li>
      <li>Nấu như bình thường và để thêm 10 phút sau khi nấu xong.</li>
    </ol>
    
    <h3>Phương pháp 2: Dùng nồi áp suất</h3>
    
    <p>Nồi áp suất là công cụ tuyệt vời để nấu gạo lứt nhanh chóng và mềm hơn:</p>
    
    <ol>
      <li>Rửa sạch gạo lứt.</li>
      <li>Cho gạo vào nồi áp suất với tỷ lệ 1:1.5 (1 phần gạo, 1.5 phần nước).</li>
      <li>Nấu trong khoảng 20 phút.</li>
      <li>Chờ áp suất giảm tự nhiên trước khi mở nắp.</li>
    </ol>
    
    <h3>Phương pháp 3: Trộn gạo lứt và gạo trắng</h3>
    
    <p>Đối với người mới chuyển từ gạo trắng sang gạo lứt, bạn có thể bắt đầu bằng cách trộn hai loại gạo với nhau:</p>
    
    <ol>
      <li>Trộn gạo lứt và gạo trắng theo tỷ lệ 1:1.</li>
      <li>Ngâm gạo lứt trước khoảng 4 giờ.</li>
      <li>Trộn với gạo trắng và nấu như bình thường.</li>
      <li>Dần dần tăng tỷ lệ gạo lứt khi đã quen với vị và kết cấu.</li>
    </ol>
    
    <h2>Cách tăng hương vị cho gạo lứt</h2>
    
    <p>Để tăng hương vị cho gạo lứt, bạn có thể:</p>
    
    <ul>
      <li>Thêm một chút dầu olive hoặc dầu mè khi nấu.</li>
      <li>Cho thêm một ít muối hoặc nước cốt dừa.</li>
      <li>Nấu gạo lứt với nước dùng rau củ thay vì nước lọc.</li>
      <li>Thêm các loại hạt, quả khô, rau thơm hoặc gia vị sau khi nấu xong.</li>
    </ul>
    
    <h2>Kết luận</h2>
    
    <p>Gạo lứt là một thực phẩm dinh dưỡng tuyệt vời với nhiều lợi ích sức khỏe. Mặc dù có thể mất nhiều thời gian hơn để nấu và làm quen với hương vị, nhưng những lợi ích sức khỏe lâu dài mà nó mang lại là hoàn toàn xứng đáng. Bằng cách áp dụng các phương pháp nấu đúng cách, bạn có thể biến gạo lứt thành một món ăn ngon, dẻo và bổ dưỡng trong thực đơn hàng ngày của mình.</p>`,
    createAt: '2025-04-15T10:30:00',
    image: {
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    user: {
      id: 1,
      name: 'Minh Thành',
      username: 'minhthanh',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80'
    },
    tags: [
      { id: 1, name: 'Sức khỏe' },
      { id: 2, name: 'Gạo lứt' },
      { id: 3, name: 'Dinh dưỡng' },
      { id: 4, name: 'Ẩm thực' }
    ]
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'd MMMM, yyyy', { locale: vi });
    } catch (error) {
      return 'Không có ngày';
    }
  };

  // Fetch blog details
  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        const response = await blogService.getBlog(id);
        
        if (response && response.data) {
          console.log('Blog detail from API:', response.data);
          setBlog(response.data);
          
          // Fetch related blogs
          try {
            // Giả sử backend có API cho bài viết liên quan
            const relatedResponse = await blogService.getBlogs();
            if (relatedResponse && relatedResponse.data) {
              // Lọc ra các bài viết khác bài hiện tại
              const otherBlogs = relatedResponse.data.filter(b => b.id !== parseInt(id));
              // Lấy tối đa 3 bài liên quan
              setRelatedBlogs(otherBlogs.slice(0, 3));
            } else {
              setRelatedBlogs(mockRelatedBlogs);
            }
          } catch (relatedError) {
            console.error('Error fetching related blogs:', relatedError);
            setRelatedBlogs(mockRelatedBlogs);
          }
        } else {
          console.warn('Blog API returned no data, using mock data instead');
          setBlog(mockBlog);
          setRelatedBlogs(mockRelatedBlogs);
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
        
        // Use mock data as fallback
        setBlog(mockBlog);
        setRelatedBlogs(mockRelatedBlogs);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogDetails();
  }, [id]);

  // Handle share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.description,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Đã sao chép đường dẫn bài viết vào bộ nhớ tạm.'))
        .catch(err => console.error('Không thể sao chép: ', err));
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Không tìm thấy bài viết'}
          </h2>
          <button 
            onClick={() => navigate('/blogs')} 
            className="mt-4 inline-flex items-center text-green-600 hover:text-green-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Quay lại trang tin tức
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header Image */}
      <div className="w-full h-64 sm:h-80 md:h-96 relative">
        {blog.image ? (
          <img 
            src={blog.image.url} 
            alt={blog.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xl">Sem imagem</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <button 
            onClick={() => navigate('/blogs')} 
            className="text-white hover:text-green-200 inline-flex items-center mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Quay lại trang tin tức
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{blog.title}</h1>
        </div>
      </div>
      
      {/* Blog Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Meta Information */}
          <div className="flex flex-wrap justify-between items-center py-6 border-b border-gray-200">
            <div className="flex items-center mb-4 md:mb-0">
              {blog.user ? (
                <>
                  {blog.user.image ? (
                    <img 
                      src={blog.user.image} 
                      alt={blog.user.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-10 h-10 text-gray-400" />
                  )}
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{blog.user.name || blog.user.username || 'Autor'}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{formatDate(blog.createAt)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center">
                  <UserCircleIcon className="w-10 h-10 text-gray-400" />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Autor desconhecido</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{formatDate(blog.createAt)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <button 
                onClick={handleShare}
                className="flex items-center text-gray-600 hover:text-green-600"
              >
                <ShareIcon className="h-5 w-5 mr-2" />
                Chia sẻ
              </button>
            </div>
          </div>
          
          {/* Tags */}
          <div className="py-4 flex flex-wrap gap-2">
            {blog.tags && blog.tags.length > 0 ? (
              blog.tags.map((tag, idx) => (
                <Link 
                  key={tag.id || idx}
                  to={`/blogs?tag=${tag.name}`}
                  className="bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag.name}
                </Link>
              ))
            ) : (
              <span className="text-sm text-gray-500">Sem tags</span>
            )}
          </div>
          
          {/* Blog Content */}
          <div 
            className="prose prose-lg max-w-none mt-6 prose-headings:text-gray-800 prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          
          {/* Author Section */}
          {blog.user && (
            <div className="mt-12 bg-gray-50 rounded-lg p-6">
              <div className="flex items-center">
                {blog.user.image ? (
                  <img 
                    src={blog.user.image} 
                    alt={blog.user.name} 
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-14 h-14 text-gray-400" />
                )}
                <div className="ml-4">
                  <p className="font-bold text-gray-900">{blog.user.name || blog.user.username || 'Autor'}</p>
                  <p className="text-gray-600">Tác giả</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700">
                Người viết các bài hướng dẫn và chia sẻ kiến thức về dinh dưỡng, thực phẩm hữu cơ và
                lối sống lành mạnh.
              </p>
            </div>
          )}
          
          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map(relatedBlog => (
                  <Link 
                    key={relatedBlog.id} 
                    to={`/blog/${relatedBlog.id}`}
                    className="group"
                  >
                    <div className="aspect-video overflow-hidden rounded-lg mb-3">
                      {relatedBlog.image ? (
                        <img 
                          src={relatedBlog.image.url} 
                          alt={relatedBlog.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">Sem imagem</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(relatedBlog.createAt)}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link 
                  to="/blogs" 
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Xem tất cả bài viết
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;