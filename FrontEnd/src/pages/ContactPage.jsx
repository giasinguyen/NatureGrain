import { useState } from "react";
import { contactService } from "../services/api";
import { toast } from "react-toastify";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const ContactPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  // Contact info state (using static data since API endpoint doesn't exist)
  const [contactInfo] = useState({
    address: "12 Nguyễn Văn Bảo, Phường 1, Quận Gò Vấp, TP.HCM",
    phone: "(+84) 348 996 487",
    email: "giasinguyentran@gmail.com",
    openingHours: "Thứ 2 - Chủ nhật: 8:00 - 20:00",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading] = useState(false); // Set to false since we're not fetching from API

  // Remove API call since the endpoint doesn't exist
  // useEffect(() => {
  //   const fetchContactInfo = async () => {
  //     try {
  //       const response = await contactService.getContactInfo();
  //       if (response.data) {
  //         setContactInfo(response.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching contact info:", error);
  //       // Keep default contact info if API fails
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchContactInfo();
  // }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Vui lòng nhập tiêu đề";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Vui lòng nhập nội dung tin nhắn";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Submit contact form to backend
        await contactService.submitContactForm(formData);

        // Show success message
        toast.success(
          "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!"
        );

        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } catch (error) {
        console.error("Error submitting contact form:", error);
        toast.error("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bạn có thắc mắc hoặc đề xuất gì cho NatureGrain? Hãy liên hệ với
            chúng tôi. Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.
          </p>
        </div>

        {/* Contact information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <MapPinIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Địa Chỉ</h3>
            <p className="text-gray-600">{contactInfo.address}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <PhoneIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Điện Thoại</h3>
            <p className="text-gray-600">{contactInfo.phone}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <EnvelopeIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-gray-600">{contactInfo.email}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Giờ Mở Cửa</h3>
            <p className="text-gray-600">{contactInfo.openingHours}</p>
          </div>
        </div>

        {/* Map and contact form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Map (3 cols) */}
          <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow-sm">            <div className="aspect-video w-full h-full">              {/* Simple map replacement to avoid Google Maps API errors */}
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                <div className="text-center">
                  <MapPinIcon className="h-16 w-16 mx-auto mb-4 text-green-600" />
                  <p className="font-medium text-lg mb-2">NatureGrain Store</p>
                  <p className="text-sm text-gray-700">12 Nguyễn Văn Bảo, Phường 1</p>
                  <p className="text-sm text-gray-700">Quận Gò Vấp, TP.HCM</p>
                  <div className="mt-4">
                    <a 
                      href="https://maps.google.com/?q=12+Nguyen+Van+Bao,+Go+Vap,+Ho+Chi+Minh+City,+Vietnam"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Xem trên Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Gửi Tin Nhắn Cho Chúng Tôi
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Họ tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:ring-green-500 focus:border-green-500`}
                    placeholder="Nhập họ tên"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:ring-green-500 focus:border-green-500`}
                    placeholder="Nhập email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.subject ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:ring-green-500 focus:border-green-500`}
                    placeholder="Nhập tiêu đề"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tin nhắn
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.message ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:ring-green-500 focus:border-green-500`}
                    placeholder="Nhập nội dung tin nhắn"
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi Tin Nhắn"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
