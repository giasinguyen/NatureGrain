import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  SparklesIcon,
  HeartIcon,
  TrophyIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import {
  ShieldCheckIcon as ShieldCheckSolidIcon,
  SparklesIcon as SparklesSolidIcon,
  HeartIcon as HeartSolidIcon,
  TrophyIcon as TrophySolidIcon
} from '@heroicons/react/24/solid';
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
      d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.5 8.5c2.5-2.5 6.5-2.5 9 0M8.5 15.5c2.5 2.5 6.5 2.5 9 0"
    />
  </svg>
);

const Icons = {
  ShieldCheckIcon,
  LeafIcon,
  SparklesIcon,
  HeartIcon,
  TrophyIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon,
  ShieldCheckSolidIcon,
  SparklesSolidIcon,
  HeartSolidIcon,
  TrophySolidIcon
};

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + 100;
      
      sections.forEach((section) => {
        const offsetTop = section.offsetTop;
        const height = section.offsetHeight;
        
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
          // Could be used for active section highlighting in future
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [aboutData] = useState({
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
          name: 'Nguyễn Trần Gia Sĩ',
          position: 'Nhà sáng lập & CEO',
          imageUrl: '/logo.png',
          bio: 'Với hơn 15 năm kinh nghiệm trong lĩnh vực nông nghiệp hữu cơ'
        },
        {
          name: 'Nguyễn Trần Gia Sĩ',
          position: 'Giám đốc Sản xuất',
          imageUrl: '/logo.png',
          bio: 'Chuyên gia trong lĩnh vực kiểm soát chất lượng và sản xuất thực phẩm'
        },
        {
          name: 'Nguyễn Trần Gia Sĩ',
          position: 'Giám đốc Marketing',
          imageUrl: '/logo.png',
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
        { name: 'Chứng nhận Hữu cơ Việt Nam', imageUrl: 'https://tqc.vn/pic/Service/chung-nha_637967659751450807.jpg' },
        { name: 'Chứng nhận USDA Organic', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPRvF2duRKzeXSVWB9XtVnFKGOmdLnWjgX8g&s' },
        { name: 'Chứng nhận EU Organic', imageUrl: 'https://chungnhanquocgia.com/wp-content/uploads/2020/12/chung-nhan-huu-co-theo-tieu-chuan-chau-au-1-1.jpg' },
        { name: 'Chứng nhận ISO 22000', imageUrl: 'https://clv.vn/wp-content/uploads/2023/05/ISO-22000-2.png' }
      ]
    }  });
  
  const [loading] = useState(false); // Set to false since we'll use default data
  
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
      <section className="py-20 bg-white relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className={`transform transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <TrophyIcon className="h-4 w-4" />
                <span>5+ năm kinh nghiệm</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {aboutData.storySection.title}
              </h2>
              
              <div className="space-y-6">
                {aboutData.storySection.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-lg text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* Key highlights */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: CheckCircleIcon, text: "100% Hữu cơ được chứng nhận" },
                  { icon: CheckCircleIcon, text: "Quy trình sản xuất nghiêm ngặt" },
                  { icon: CheckCircleIcon, text: "Phân phối toàn quốc" },
                  { icon: CheckCircleIcon, text: "Cam kết chất lượng cao" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Image */}
            <div className={`relative transform transition-all duration-1000 delay-400 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}>
              <div className="relative">
                {/* Main image */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src={aboutData.storySection.imageUrl} 
                    alt="NatureGrain Story" 
                    className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <LeafIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">100%</div>
                      <div className="text-sm text-gray-600">Hữu cơ tự nhiên</div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-100 rounded-full opacity-60"></div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-200 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
        {/* Mission and vision */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-8">
              <HeartIcon className="h-4 w-4" />
              <span>Giá trị cốt lõi của chúng tôi</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-16">
              {aboutData.missionSection.title}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Sứ mệnh",
                content: aboutData.missionSection.mission,
                icon: TrophySolidIcon,
                delay: "delay-500"
              },
              {
                title: "Tầm nhìn", 
                content: aboutData.missionSection.vision,
                icon: SparklesSolidIcon,
                delay: "delay-700"
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className={`group p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${item.delay} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-colors">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-green-100 leading-relaxed text-lg">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
        {/* Core values */}
      <section className="py-20 bg-gray-50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className={`transform transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Những điều chúng tôi tin tưởng</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {aboutData.valuesSection.title}
              </h2>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Những giá trị này định hướng mọi hoạt động của chúng tôi, từ cách chúng tôi tương tác với khách hàng đến cách chúng tôi phát triển sản phẩm.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutData.valuesSection.values.map((value, idx) => {
              const IconComponent = Icons[value.icon] || Icons.ShieldCheckIcon;
              const SolidIconComponent = Icons[value.icon.replace('Icon', 'SolidIcon')] || Icons.ShieldCheckSolidIcon;
              
              return (
                <div 
                  key={idx} 
                  className={`group p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-green-200 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${300 + idx * 100}ms` }}
                >
                  <div className="relative mb-6">
                    {/* Background circle with gradient */}
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto group-hover:from-green-500 group-hover:to-green-600 transition-all duration-300 transform group-hover:scale-110">
                      {/* Outline icon (default) */}
                      <IconComponent className="h-8 w-8 text-green-600 group-hover:text-white transition-colors duration-300 group-hover:opacity-0 absolute" />
                      {/* Solid icon (on hover) */}
                      <SolidIconComponent className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 absolute" />
                    </div>
                    
                    {/* Decorative ring */}
                    <div className="absolute inset-0 w-16 h-16 mx-auto rounded-2xl border-2 border-green-200 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-gray-900 text-center group-hover:text-green-700 transition-colors">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center leading-relaxed group-hover:text-gray-700 transition-colors">
                    {value.description}
                  </p>
                  
                  {/* Hover indicator */}
                  <div className="mt-6 flex justify-center">
                    <div className="w-8 h-1 bg-green-200 rounded-full group-hover:bg-green-500 group-hover:w-12 transition-all duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
        {/* Team section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-50 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className={`transform transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <UserGroupIcon className="h-4 w-4" />
                <span>Gặp gỡ đội ngũ chúng tôi</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {aboutData.teamSection.title}
              </h2>
              
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                {aboutData.teamSection.description}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {aboutData.teamSection.members.map((member, idx) => (
              <div 
                key={idx} 
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-2 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${400 + idx * 150}ms` }}
              >
                {/* Image section */}
                <div className="relative overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 p-8">
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
                      <img 
                        src={member.imageUrl} 
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                    <div className="text-white text-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                        <UserGroupIcon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content section */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                    {member.name}
                  </h3>
                  
                  <p className="text-green-600 font-semibold mb-4 text-sm uppercase tracking-wide">
                    {member.position}
                  </p>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                  
                  {/* Decorative element */}
                  <div className="mt-4 flex justify-center">
                    <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
        {/* Stats section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-green-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-green-200 rounded-full opacity-15 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className={`transform transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <TrophyIcon className="h-4 w-4" />
                <span>Thành tựu của chúng tôi</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {aboutData.statsSection.title}
              </h2>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Những con số này phản ánh cam kết và sự tin tưởng mà khách hàng dành cho NatureGrain.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {aboutData.statsSection.stats.map((stat, idx) => (
              <div 
                key={idx} 
                className={`group text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100 hover:border-green-200 transform hover:-translate-y-1 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${300 + idx * 100}ms` }}
              >
                {/* Icon background */}
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-green-500 group-hover:to-green-600 transition-all duration-300">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:bg-white/90 transition-colors">
                    <div className="w-3 h-3 bg-green-500 rounded-full group-hover:bg-green-600"></div>
                  </div>
                </div>
                
                {/* Number */}
                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="text-gray-600 font-medium group-hover:text-gray-700 transition-colors">
                  {stat.label}
                </div>
                
                {/* Progress bar */}
                <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transform origin-left transition-transform duration-1000 ease-out"
                    style={{ 
                      transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
                      transitionDelay: `${600 + idx * 200}ms`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
        {/* Certificates section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className={`transform transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Được công nhận bởi</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {aboutData.certificatesSection.title}
              </h2>
              
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                {aboutData.certificatesSection.description}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {aboutData.certificatesSection.certificates.map((cert, idx) => (
              <div 
                key={idx} 
                className={`group bg-gray-50 hover:bg-white p-6 rounded-2xl transition-all duration-500 border border-gray-100 hover:border-green-200 hover:shadow-lg transform hover:-translate-y-1 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${400 + idx * 100}ms` }}
              >
                <div className="aspect-square flex items-center justify-center mb-4 bg-white rounded-xl p-4 group-hover:bg-green-50 transition-colors">
                  <img 
                    src={cert.imageUrl} 
                    alt={cert.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/dummy.png';
                    }}
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 text-center group-hover:text-green-700 transition-colors">
                  {cert.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10"></div>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Khám phá các sản phẩm của 
                <span className="block bg-gradient-to-r from-green-200 to-white bg-clip-text text-transparent">
                  NatureGrain
                </span>
              </h2>
              
              <p className="text-xl lg:text-2xl mb-12 text-green-100 leading-relaxed">
                Trải nghiệm các sản phẩm hữu cơ chất lượng cao từ NatureGrain và tham gia cùng chúng tôi trong hành trình xây dựng một lối sống xanh, bền vững.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/products" 
                  className="group bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3"
                >
                  <span>Xem sản phẩm</span>
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  to="/contact" 
                  className="group bg-green-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-800/70 transition-all duration-300 border border-green-500/30 hover:border-green-400/50 flex items-center justify-center gap-3"
                >
                  <HeartIcon className="h-5 w-5" />
                  <span>Liên hệ với chúng tôi</span>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-12 pt-12 border-t border-white/20">
                <div className="flex flex-wrap justify-center items-center gap-8 text-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="text-sm">Giao hàng toàn quốc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="text-sm">Chứng nhận hữu cơ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="text-sm">Chất lượng đảm bảo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;