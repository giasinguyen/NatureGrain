import { useState } from 'react';
import {
  DocumentTextIcon,
  ChartBarIcon,
  ChartPieIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ClockIcon,
  CalendarIcon,
  QuestionMarkCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const AnalyticsDocumentation = () => {
  const [activeSection, setActiveSection] = useState('overview');
  
  const sections = [
    { id: 'overview', name: 'Tổng quan', icon: <DocumentTextIcon className="h-5 w-5" /> },
    { id: 'basic', name: 'Phân tích cơ bản', icon: <ChartBarIcon className="h-5 w-5" /> },
    { id: 'advanced', name: 'Phân tích nâng cao', icon: <ChartPieIcon className="h-5 w-5" /> },
    { id: 'export', name: 'Xuất báo cáo', icon: <ArrowDownTrayIcon className="h-5 w-5" /> },
    { id: 'faq', name: 'Câu hỏi thường gặp', icon: <QuestionMarkCircleIcon className="h-5 w-5" /> }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'basic':
        return <BasicAnalyticsSection />;
      case 'advanced':
        return <AdvancedAnalyticsSection />;
      case 'export':
        return <ExportSection />;
      case 'faq':
        return <FaqSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hướng dẫn sử dụng Phân tích</h1>
      
      {/* Navigation */}
      <div className="flex overflow-x-auto space-x-4 pb-4 mb-6 border-b">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`flex items-center px-4 py-2 text-sm rounded-md whitespace-nowrap ${
              activeSection === section.id
                ? 'bg-indigo-100 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="mr-2">{section.icon}</span>
            {section.name}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="prose max-w-none">
        {renderContent()}
      </div>
    </div>
  );
};

const OverviewSection = () => (
  <div>
    <h2>Tổng quan về Hệ thống Phân tích</h2>
    <p>
      Hệ thống phân tích NatureGrain cung cấp các công cụ để hiểu sâu về hoạt động kinh doanh, 
      hành vi khách hàng, và hiệu suất sản phẩm. Mục tiêu là giúp bạn:
    </p>
    
    <ul>
      <li><strong>Tối ưu hóa doanh thu</strong> - Phân tích xu hướng doanh thu và xác định cơ hội tăng trưởng</li>
      <li><strong>Cải thiện trải nghiệm khách hàng</strong> - Hiểu sâu về hành vi và nhu cầu khách hàng</li>
      <li><strong>Tối ưu hóa hàng tồn kho</strong> - Xác định sản phẩm hiệu quả và xu hướng thị trường</li>
      <li><strong>Ra quyết định hiệu quả</strong> - Sử dụng dữ liệu thực tế để đưa ra quyết định kinh doanh</li>
    </ul>

    <h3>Phân tích Cơ bản & Nâng cao</h3>
    <p>
      NatureGrain cung cấp hai loại phân tích:
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-2">
          <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
          <h4 className="font-medium text-lg">Phân tích Cơ bản</h4>
        </div>
        <p>Các biểu đồ và báo cáo cơ bản về doanh số, khách hàng, sản phẩm bán chạy...</p>
        <p className="text-sm mt-2">Phù hợp cho người dùng muốn có cái nhìn tổng quan nhanh về tình hình kinh doanh.</p>
      </div>
      
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-2">
          <ChartPieIcon className="h-5 w-5 text-purple-500 mr-2" />
          <h4 className="font-medium text-lg">Phân tích Nâng cao</h4>
        </div>
        <p>Phân tích chuyên sâu về RFM, giỏ hàng, phễu mua sắm, phân tích đoàn hệ...</p>
        <p className="text-sm mt-2">Phù hợp cho phân tích chuyên sâu và ra quyết định chiến lược kinh doanh.</p>
      </div>
    </div>
    
    <h3>Bắt đầu sử dụng</h3>
    <p>
      Để bắt đầu, hãy chọn tab "Phân tích Cơ bản" hoặc "Phân tích Nâng cao" trong trang phân tích. 
      Bạn có thể chuyển đổi giữa các chế độ xem bất kỳ lúc nào để truy cập các loại phân tích khác nhau.
    </p>
    
    <div className="bg-blue-50 p-4 rounded-lg mt-4">
      <h4 className="text-blue-700 font-medium">Gợi ý</h4>
      <p className="text-sm text-blue-600">
        Hầu hết các biểu đồ đều cho phép xuất dữ liệu dưới dạng CSV. Tìm biểu tượng tải xuống ở góc mỗi biểu đồ.
      </p>
    </div>
  </div>
);

const BasicAnalyticsSection = () => (
  <div>
    <h2>Phân tích Cơ bản</h2>
    <p>
      Phân tích cơ bản cung cấp cái nhìn tổng quan về hiệu suất kinh doanh. Các biểu đồ này giúp bạn nhanh chóng đánh giá 
      tình hình kinh doanh và xác định các xu hướng.
    </p>
    
    <div className="border-t my-4 pt-4">
      <h3 className="flex items-center text-lg">
        <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
        Xu hướng Doanh thu
      </h3>
      <p>
        Hiển thị xu hướng doanh thu theo thời gian, cho phép bạn xem dữ liệu theo ngày, tuần, hoặc tháng 
        và điều chỉnh phạm vi thời gian.
      </p>
      <ul className="mt-2">
        <li><strong>Thống kê chính:</strong> Tổng doanh thu, Tổng đơn hàng, Giá trị đơn hàng trung bình</li>
        <li><strong>Sử dụng:</strong> Xác định xu hướng doanh thu và đặt mục tiêu kinh doanh</li>
      </ul>
    </div>
    
    <div className="border-t my-4 pt-4">
      <h3 className="flex items-center text-lg">
        <UserGroupIcon className="h-5 w-5 text-green-500 mr-2" />
        Tăng trưởng Người dùng
      </h3>
      <p>
        Theo dõi số lượng người dùng mới và tổng số người dùng theo thời gian, với khả năng phân tích tỷ lệ tăng trưởng.
      </p>
      <ul className="mt-2">
        <li><strong>Thống kê chính:</strong> Tổng người dùng, Người dùng mới, Tỷ lệ tăng trưởng</li>
        <li><strong>Sử dụng:</strong> Đánh giá hiệu quả của các chiến dịch marketing và mở rộng khách hàng</li>
      </ul>
    </div>
    
    <div className="border-t my-4 pt-4">
      <h3 className="flex items-center text-lg">
        <ShoppingBagIcon className="h-5 w-5 text-orange-500 mr-2" />
        Hiệu suất Sản phẩm
      </h3>
      <p>
        Hiển thị các sản phẩm bán chạy nhất và phân tích doanh thu theo sản phẩm.
      </p>
      <ul className="mt-2">
        <li><strong>Thống kê chính:</strong> Số lượng bán, Doanh thu, Tỷ lệ hoàn trả</li>
        <li><strong>Sử dụng:</strong> Xác định sản phẩm hiệu quả nhất và tối ưu hóa hàng tồn kho</li>
      </ul>
    </div>
    
    <div className="border-t my-4 pt-4">
      <h3 className="flex items-center text-lg">
        <ChartPieIcon className="h-5 w-5 text-red-500 mr-2" />
        Phân bố Trạng thái Đơn hàng
      </h3>
      <p>
        Hiển thị phân bố đơn hàng theo các trạng thái khác nhau.
      </p>
      <ul className="mt-2">
        <li><strong>Thống kê chính:</strong> Số lượng đơn hàng theo trạng thái, Tỷ lệ hoàn thành</li>
        <li><strong>Sử dụng:</strong> Đánh giá hiệu quả của quy trình xử lý đơn hàng và xác định điểm nghẽn</li>
      </ul>
    </div>
  </div>
);

const AdvancedAnalyticsSection = () => (
  <div>
    <h2>Phân tích Nâng cao</h2>
    <p>
      Phân tích nâng cao cung cấp cái nhìn sâu hơn về hành vi khách hàng và hiệu suất kinh doanh. 
      Các công cụ này giúp đưa ra quyết định chiến lược dựa trên dữ liệu.
    </p>
    
    <div className="border-t my-4 pt-4">
      <h3 className="flex items-center text-lg">
        <UserGroupIcon className="h-5 w-5 text-blue-500 mr-2" />
        Phân tích RFM
      </h3>
      <p>
        Phân khúc khách hàng dựa trên ba yếu tố: Recency (Gần đây), Frequency (Tần suất) và Monetary (Giá trị).
      </p>
      <ul className="mt-2">
        <li><strong>Phân khúc:</strong> VIP, Loyal, Big Spender, Recent, Regular, At Risk</li>
        <li><strong>Sử dụng:</strong> Định hướng chiến lược tiếp thị và giữ chân khách hàng dựa trên phân khúc</li>
      </ul>
    </div>
    
    <div className="border-t my-4 pt-4">
      <h3 className="flex items-center text-lg">
        <ShoppingBagIcon className="h-5 w-5 text-green-500 mr-2" />
        Phân tích Giỏ hàng
      </h3>
      <p>
        Xác định các sản phẩm thường được mua cùng nhau, giúp cải thiện khuyến nghị sản phẩm và chiến lược upsell/cross-sell.
      </p>
      <ul className="mt-2">
        <li><strong>Thống kê chính:</strong> Tương quan sản phẩm, Tần suất mua chung, Cặp sản phẩm phổ biến</li>
        <li><strong>Sử dụng:</strong> Tối ưu hóa bố trí cửa hàng, gợi ý sản phẩm và tạo gói sản phẩm</li>
      </ul>
    </div>
    
    <div className="border-t my-4 pt-4">
      <h3 className="flex items-center text-lg">
        <ChartBarIcon className="h-5 w-5 text-purple-500 mr-2" />
        Phân tích Phễu
      </h3>
      <p>
        Theo dõi hành trình khách hàng qua các giai đoạn mua sắm, giúp xác định và khắc phục điểm bỏ cuộc.
      </p>
      <ul className="mt-2">
        <li><strong>Giai đoạn:</strong> Xem sản phẩm, Thêm vào giỏ hàng, Bắt đầu thanh toán, Hoàn thành đơn hàng</li>
        <li><strong>Sử dụng:</strong> Cải thiện trải nghiệm người dùng và tăng tỷ lệ chuyển đổi</li>
      </ul>
    </div>
    
    <div className="border-t my-4 pt-4">
      <h3 className="flex items-center text-lg">
        <CalendarIcon className="h-5 w-5 text-red-500 mr-2" />
        Phân tích Đoàn hệ
      </h3>
      <p>
        Theo dõi hành vi của các nhóm khách hàng theo thời gian dựa trên thời điểm họ thực hiện giao dịch đầu tiên.
      </p>
      <ul className="mt-2">
        <li><strong>Thống kê chính:</strong> Tỷ lệ giữ chân khách hàng, Giá trị vòng đời, Hành vi mua lại</li>
        <li><strong>Sử dụng:</strong> Đánh giá mức độ gắn bó của khách hàng và hiệu quả của các chiến dịch giữ chân</li>
      </ul>
    </div>
    
    <div className="border-t my-4 pt-4">
      <h3 className="flex items-center text-lg">
        <ClockIcon className="h-5 w-5 text-orange-500 mr-2" />
        Phân tích Thời gian
      </h3>
      <p>
        Các công cụ phân tích thời gian như Mức độ hoạt động theo giờ và ngày, Xu hướng theo mùa, và Thời gian xử lý đơn hàng.
      </p>
      <ul className="mt-2">
        <li><strong>Biểu đồ:</strong> Bản đồ nhiệt theo ngày/giờ, Phân tích theo mùa, Thời gian xử lý đơn hàng</li>
        <li><strong>Sử dụng:</strong> Tối ưu hóa lịch trình nhân viên, chuẩn bị cho mùa cao điểm, cải thiện dịch vụ khách hàng</li>
      </ul>
    </div>
  </div>
);

const ExportSection = () => (
  <div>
    <h2>Xuất Báo cáo</h2>
    <p>
      NatureGrain cho phép bạn xuất dữ liệu phân tích dưới dạng CSV để phân tích thêm hoặc chia sẻ với đội ngũ. 
      Hầu hết các biểu đồ đều có tính năng xuất dữ liệu.
    </p>
    
    <h3 className="mt-4">Cách xuất dữ liệu</h3>
    <ol className="list-decimal list-inside ml-4">
      <li>Tìm biểu tượng tải xuống <ArrowDownTrayIcon className="h-4 w-4 inline text-green-500" /> ở góc phải của biểu đồ.</li>
      <li>Click vào biểu tượng để tải xuống dữ liệu dạng CSV.</li>
      <li>Mở file bằng Excel, Google Sheets hoặc phần mềm xử lý bảng tính khác.</li>
    </ol>
    
    <div className="bg-yellow-50 p-4 rounded-lg mt-4">
      <h4 className="text-yellow-700 font-medium">Lưu ý</h4>
      <p className="text-sm">
        Dữ liệu xuất ra sẽ phản ánh các bộ lọc hiện tại được áp dụng cho biểu đồ. Ví dụ: nếu bạn đã lọc dữ liệu để chỉ 
        hiển thị 30 ngày qua, file CSV sẽ chỉ chứa dữ liệu trong khoảng thời gian đó.
      </p>
    </div>
    
    <h3 className="mt-4">Danh sách báo cáo có thể xuất</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      <div className="border rounded-lg p-3">
        <h4 className="font-medium">Phân tích RFM</h4>
        <p className="text-sm text-gray-600">
          Dữ liệu phân khúc khách hàng, điểm số RFM và chỉ số liên quan
        </p>
      </div>
      
      <div className="border rounded-lg p-3">
        <h4 className="font-medium">Giá trị Vòng đời Khách hàng</h4>
        <p className="text-sm text-gray-600">
          CLV của khách hàng, số lượng đơn hàng, chi tiêu trung bình
        </p>
      </div>
      
      <div className="border rounded-lg p-3">
        <h4 className="font-medium">Phân tích Giỏ hàng</h4>
        <p className="text-sm text-gray-600">
          Cặp sản phẩm phổ biến, mức độ liên kết
        </p>
      </div>
      
      <div className="border rounded-lg p-3">
        <h4 className="font-medium">Phân tích theo Khoảng thời gian</h4>
        <p className="text-sm text-gray-600">
          Doanh số, số lượng đơn hàng theo khoảng thời gian tùy chỉnh
        </p>
      </div>
    </div>
    
    <h3 className="mt-4">Sử dụng dữ liệu xuất</h3>
    <p>
      Dữ liệu xuất từ NatureGrain có thể được sử dụng để:
    </p>
    <ul className="list-disc list-inside ml-4">
      <li>Tạo báo cáo tùy chỉnh trong Excel hoặc công cụ BI</li>
      <li>Chia sẻ thông tin với nhóm không có quyền truy cập vào bảng điều khiển</li>
      <li>Kết hợp với dữ liệu từ các nguồn khác để phân tích chuyên sâu hơn</li>
      <li>Lưu trữ dữ liệu lịch sử để phân tích xu hướng dài hạn</li>
    </ul>
  </div>
);

const FaqSection = () => (
  <div>
    <h2>Câu hỏi Thường gặp</h2>
    
    <div className="space-y-6 mt-4">
      <div>
        <h3 className="text-lg font-medium">Dữ liệu được cập nhật thường xuyên như thế nào?</h3>
        <p>
          Dữ liệu phân tích được cập nhật theo thời gian thực cho hầu hết các biểu đồ. Một số phân tích phức tạp hơn 
          (như Phân tích RFM hoặc CLV) được cập nhật mỗi 24 giờ.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium">Làm thế nào để hiểu phân khúc khách hàng trong phân tích RFM?</h3>
        <p>
          Phân tích RFM chia khách hàng thành các phân khúc dựa trên thời gian mua hàng gần đây (Recency), 
          tần suất mua hàng (Frequency) và giá trị chi tiêu (Monetary). Cụ thể:
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li><strong>VIP:</strong> Khách hàng điểm cao ở cả ba yếu tố</li>
          <li><strong>Loyal:</strong> Khách hàng thường xuyên mua hàng với giá trị cao</li>
          <li><strong>Big Spender:</strong> Chi tiêu lớn nhưng không thường xuyên</li>
          <li><strong>Recent:</strong> Mới mua gần đây nhưng chưa mua nhiều lần</li>
          <li><strong>Regular:</strong> Mua hàng thường xuyên với giá trị trung bình</li>
          <li><strong>At Risk:</strong> Đã lâu không mua hàng, có thể cần chiến lược giữ chân</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium">Làm thế nào để sử dụng phân tích giỏ hàng để tăng doanh số?</h3>
        <p>
          Phân tích giỏ hàng cho thấy các sản phẩm thường được mua cùng nhau. Bạn có thể sử dụng thông tin này để:
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Tạo gói sản phẩm có liên quan</li>
          <li>Thiết lập hệ thống khuyến nghị "Khách hàng thường mua cùng..."</li>
          <li>Sắp xếp sản phẩm liên quan gần nhau trong cửa hàng</li>
          <li>Tạo chiến dịch tiếp thị nhắm mục tiêu dựa trên sản phẩm đã mua</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium">Làm thế nào để tối ưu hóa hiệu suất cho bảng điều khiển phân tích với dữ liệu lớn?</h3>
        <p>
          Để cải thiện hiệu suất khi làm việc với tập dữ liệu lớn:
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Sử dụng bộ lọc để giới hạn phạm vi dữ liệu được hiển thị</li>
          <li>Điều chỉnh khoảng thời gian cho biểu đồ dựa trên nhu cầu phân tích</li>
          <li>Khi xuất báo cáo lớn, hãy sử dụng các bộ lọc để giới hạn dữ liệu trước khi xuất</li>
          <li>Đóng các tab trình duyệt không sử dụng để giải phóng bộ nhớ</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium">Tôi có thể tùy chỉnh các chỉ số và biểu đồ được không?</h3>
        <p>
          Hiện tại, NatureGrain cung cấp một bộ biểu đồ và chỉ số được định nghĩa trước. Tuy nhiên, 
          bạn có thể xuất dữ liệu dạng CSV và tạo các biểu đồ tùy chỉnh trong Excel hoặc các công cụ BI khác.
        </p>
        <p className="mt-2">
          Chúng tôi đang phát triển tính năng cho phép người dùng tạo biểu đồ và bảng điều khiển tùy chỉnh trong các phiên bản tương lai.
        </p>
      </div>
    </div>
  </div>
);

export default AnalyticsDocumentation;
