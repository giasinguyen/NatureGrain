import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  SparklesIcon,
  HeartIcon,
  TrophyIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LeafIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 14s1.5 2 4 2 4-2 4-2"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 9h.01M15 9h.01"
    />
  </svg>
);

const Icons = {
  ShieldCheckIcon,
  LeafIcon,
  SparklesIcon,
  HeartIcon,
  TrophyIcon,
  UserGroupIcon
};

const AboutPage = () => {
  const [aboutData, setAboutData] = useState({
    heroSection: {
      title: 'Về NatureGrain',
      subtitle: 'Thực phẩm hữu cơ - Cuộc sống xanh',
      description: 'NatureGrain là thương hiệu thực phẩm hữu cơ hàng đầu với sứ mệnh mang đến những sản phẩm chất lượng cao, thuần khiết từ thiên nhiên. Chúng tôi cam kết cung cấp các sản phẩm an toàn, bổ dưỡng và thân thiện với môi trường.',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    storySection: {
      title: 'Câu chuyện của chúng tôi',
      content: 'NatureGrain được thành lập vào năm 2020 bởi một nhóm những người đam mê nông nghiệp hữu cơ và sức khỏe cộng đồng. Chúng tôi bắt đầu từ một trang trại nhỏ với mong muốn cung cấp thực phẩm hữu cơ chất lượng cao đến với nhiều người tiêu dùng hơn. Sau 5 năm phát triển, NatureGrain đã trở thành thương hiệu uy tín trong lĩnh vực thực phẩm hữu cơ, với mạng lưới phân phối rộng khắp cả nước.\n\nChúng tôi không chỉ đơn thuần là nhà cung cấp thực phẩm, mà còn là người bạn đồng hành trên hành trình xây dựng lối sống lành mạnh, bền vững. Từ những hạt giống chất lượng đến quy trình sản xuất nghiêm ngặt, mọi công đoạn đều được chúng tôi kiểm soát chặt chẽ để đảm bảo sản phẩm đạt tiêu chuẩn hữu cơ quốc tế.',
      imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    missionSection: {
      title: 'Sứ mệnh và Tầm nhìn',
      mission: 'Mang đến cho mọi gia đình Việt Nam những sản phẩm thực phẩm hữu cơ chất lượng cao, an toàn và giàu dinh dưỡng.',
      vision: 'Trở thành thương hiệu thực phẩm hữu cơ hàng đầu Việt Nam, đóng góp vào việc xây dựng một cộng đồng khỏe mạnh và môi trường bền vững.'
    },
    valuesSection: {
      title: 'Giá trị cốt lõi',
      values: [
        {
          icon: 'ShieldCheckIcon',
          title: 'Chất lượng',
          description: 'Cam kết cung cấp sản phẩm chất lượng cao theo tiêu chuẩn hữu cơ quốc tế'
        },
        {
          icon: 'LeafIcon',
          title: 'Bền vững',
          description: 'Ứng dụng các phương pháp sản xuất bền vững, thân thiện với môi trường'
        },
        {
          icon: 'HeartIcon',
          title: 'Chân thành',
          description: 'Minh bạch trong mọi hoạt động, từ nguồn gốc sản phẩm đến quy trình sản xuất'
        },
        {
          icon: 'SparklesIcon',
          title: 'Đổi mới',
          description: 'Không ngừng cải tiến và phát triển sản phẩm mới đáp ứng nhu cầu khách hàng'
        }
      ]
    },
    teamSection: {
      title: 'Đội ngũ của chúng tôi',
      description: 'Đội ngũ NatureGrain là những người đam mê với nông nghiệp hữu cơ và phát triển bền vững. Chúng tôi làm việc với tình yêu, sự tận tâm và trách nhiệm cao nhất.',
      members: [
        {
          name: 'Nguyễn Văn A',
          position: 'Nhà sáng lập & CEO',
          imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
          bio: 'Với hơn 15 năm kinh nghiệm trong lĩnh vực nông nghiệp hữu cơ'
        },
        {
          name: 'Trần Thị B',
          position: 'Giám đốc Sản xuất',
          imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
          bio: 'Chuyên gia trong lĩnh vực kiểm soát chất lượng và sản xuất thực phẩm'
        },
        {
          name: 'Lê Văn C',
          position: 'Giám đốc Marketing',
          imageUrl: 'https://randomuser.me/api/portraits/men/59.jpg',
          bio: 'Hơn 10 năm kinh nghiệm xây dựng thương hiệu và phát triển thị trường'
        }
      ]
    },
    statsSection: {
      title: 'NatureGrain qua những con số',
      stats: [
        { label: 'Năm thành lập', value: '2020' },
        { label: 'Sản phẩm hữu cơ', value: '100+' },
        { label: 'Khách hàng', value: '10,000+' },
        { label: 'Tỉnh thành phân phối', value: '63' }
      ]
    },
    certificatesSection: {
      title: 'Chứng nhận',
      description: 'NatureGrain tự hào được công nhận bởi các tổ chức uy tín trong và ngoài nước về chất lượng sản phẩm hữu cơ.',
      certificates: [
        { name: 'Chứng nhận Hữu cơ Việt Nam', imageUrl: '/certificates/organic-vn.png' },
        { name: 'Chứng nhận USDA Organic', imageUrl: '/certificates/usda-organic.png' },
        { name: 'Chứng nhận EU Organic', imageUrl: '/certificates/eu-organic.png' },
        { name: 'Chứng nhận ISO 22000', imageUrl: '/certificates/iso-22000.png' }
      ]
    }
  });
  
  const [loading, setLoading] = useState(false); // Set to false since we'll use default data
  
  // Comment out API fetching until the backend endpoint is available
  /*
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await aboutService.getAboutPageData();
        if (response.data) {
          setAboutData({
            ...aboutData, // Keep default data structure
            ...response.data // Override with data from API
          });
        }
      } catch (error) {
        console.error('Error fetching about page data:', error);
        // Keep default data if API fails
      } finally {
        setLoading(false);
      }
    };
    
    fetchAboutData();
  }, []);
  */
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50">
      {/* Hero section */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${aboutData.heroSection.imageUrl})`,
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
          }}
        ></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-24 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {aboutData.heroSection.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            {aboutData.heroSection.subtitle}
          </p>
          <p className="max-w-3xl mx-auto text-gray-200">
            {aboutData.heroSection.description}
          </p>
        </div>
      </section>
      
      {/* Our story section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {aboutData.storySection.title}
              </h2>
              <div className="prose prose-green max-w-none">
                {aboutData.storySection.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <img 
                src={aboutData.storySection.imageUrl} 
                alt="NatureGrain Story" 
                className="rounded-lg shadow-md w-full h-auto object-cover"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission and vision */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">
            {aboutData.missionSection.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white bg-opacity-10 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Sứ mệnh</h3>
              <p>{aboutData.missionSection.mission}</p>
            </div>
            
            <div className="p-6 bg-white bg-opacity-10 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Tầm nhìn</h3>
              <p>{aboutData.missionSection.vision}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            {aboutData.valuesSection.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutData.valuesSection.values.map((value, idx) => {
              // Get icon component from our Icons object, or default to ShieldCheckIcon
              const IconComponent = Icons[value.icon] || Icons.ShieldCheckIcon;
              
              return (
                <div key={idx} className="p-6 bg-gray-50 rounded-lg text-center">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Team section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            {aboutData.teamSection.title}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-center mb-12">
            {aboutData.teamSection.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutData.teamSection.members.map((member, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="mb-4 w-24 h-24 rounded-full overflow-hidden mx-auto">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {member.name}
                </h3>
                <p className="text-green-600 font-medium mb-3">
                  {member.position}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            {aboutData.statsSection.title}
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutData.statsSection.stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Certificates section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            {aboutData.certificatesSection.title}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-center mb-12">
            {aboutData.certificatesSection.description}
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutData.certificatesSection.certificates.map((cert, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="mb-4 h-24 flex items-center justify-center">
                  <img 
                    src={cert.imageUrl} 
                    alt={cert.name}
                    className="h-20 w-auto"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/dummy.png';
                    }}
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-800">
                  {cert.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Khám phá các sản phẩm của NatureGrain
          </h2>
          <p className="max-w-2xl mx-auto mb-8">
            Trải nghiệm các sản phẩm hữu cơ chất lượng cao từ NatureGrain và tham gia cùng chúng tôi trong hành trình xây dựng một lối sống xanh, bền vững.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/products" className="bg-white text-green-700 px-8 py-3 rounded-md font-medium hover:bg-green-50 transition-colors">
              Xem sản phẩm
            </Link>
            <Link to="/contact" className="bg-green-700 text-white px-8 py-3 rounded-md font-medium hover:bg-green-800 transition-colors">
              Liên hệ với chúng tôi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;