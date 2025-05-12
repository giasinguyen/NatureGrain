// Script để kiểm thử chức năng API mới liên kết Order Details với Products

// URL API cơ sở
const baseUrl = 'http://localhost:8080/api';

// Token đăng nhập admin (phải lấy từ hệ thống sau khi đăng nhập)
const adminToken = 'YOUR_ADMIN_TOKEN_HERE'; // Thay đổi token này sau khi đăng nhập

// 1. Lấy danh sách tất cả OrderDetail không có liên kết Product
async function getOrderDetailsWithoutProduct() {
  try {
    const response = await fetch(`${baseUrl}/order-details/without-product`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    console.log('OrderDetails không có liên kết Product:', data);
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy OrderDetails không có product:', error);
    return null;
  }
}

// 2. Cập nhật tất cả liên kết product cho OrderDetails
async function updateAllProductAssociations() {
  try {
    const response = await fetch(`${baseUrl}/order/update-product-associations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    console.log('Kết quả cập nhật liên kết sản phẩm:', data);
    return data;
  } catch (error) {
    console.error('Lỗi khi cập nhật liên kết sản phẩm:', error);
    return null;
  }
}

// 3. Liên kết một OrderDetail cụ thể với một Product
async function associateOrderDetailWithProduct(orderDetailId, productId) {
  try {
    const response = await fetch(`${baseUrl}/order/order-detail/${orderDetailId}/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    console.log(`Đã liên kết OrderDetail #${orderDetailId} với Product #${productId}:`, data);
    return data;
  } catch (error) {
    console.error('Lỗi khi liên kết OrderDetail với Product:', error);
    return null;
  }
}

// 4. Tạo đơn hàng mới có liên kết Product
async function createOrderWithProductLinks() {
  const orderData = {
    firstname: "Nguyễn",
    lastname: "Văn Test",
    email: "test@example.com",
    phone: "0901234567",
    country: "Việt Nam",
    address: "123 Đường Test",
    town: "Quận 1",
    state: "TP HCM",
    postCode: 70000,
    note: "Đơn hàng thử nghiệm API",
    username: "customer1", // Phải là username có trong hệ thống
    orderDetails: [
      {
        name: "Bánh Gạo Lứt Hữu Cơ",
        price: 35000,
        quantity: 2,
        productId: 21 // ID của sản phẩm "Bánh Gạo Lứt Hữu Cơ", cần điều chỉnh nếu ID thực tế khác
      },
      {
        name: "Dầu Oliu Hữu Cơ",
        price: 120000,
        quantity: 1,
        productId: 22 // ID của sản phẩm "Dầu Oliu Hữu Cơ", cần điều chỉnh nếu ID thực tế khác
      }
    ]
  };

  try {
    const response = await fetch(`${baseUrl}/order/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    const data = await response.json();
    console.log('Kết quả tạo đơn hàng mới với liên kết sản phẩm:', data);
    return data;
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng mới:', error);
    return null;
  }
}

// 5. Lấy thông tin chi tiết của một đơn hàng để kiểm tra liên kết Product
async function getOrderDetails(orderId) {
  try {
    const response = await fetch(`${baseUrl}/order/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    console.log(`Thông tin chi tiết đơn hàng #${orderId}:`, data);
    
    // Hiển thị thông tin chi tiết về liên kết sản phẩm
    if (data.orderDetails) {
      data.orderDetails.forEach(detail => {
        if (detail.product) {
          console.log(`OrderDetail #${detail.id}: Liên kết với sản phẩm "${detail.product.name}" (ID: ${detail.product.id})`);
        } else {
          console.log(`OrderDetail #${detail.id}: Không có liên kết sản phẩm`);
        }
      });
    }
    
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin đơn hàng:', error);
    return null;
  }
}

// Gọi các hàm kiểm thử theo thứ tự
async function runTests() {
  // Đầu tiên, tạo đơn hàng mới với liên kết sản phẩm
  const newOrder = await createOrderWithProductLinks();
  
  if (newOrder) {
    // Lấy OrderID mới tạo (cần điều chỉnh dựa trên API response thực tế)
    const newOrderId = newOrder.id || 1;
    
    // Kiểm tra chi tiết đơn hàng mới
    await getOrderDetails(newOrderId);
  }
  
  // Cập nhật tất cả liên kết sản phẩm cho OrderDetails chưa có liên kết
  await updateAllProductAssociations();
  
  // Liên kết một OrderDetail cụ thể với sản phẩm (cần điều chỉnh ID)
  // await associateOrderDetailWithProduct(1, 1);
}

// Hướng dẫn sử dụng
console.log(`
=== HƯỚNG DẪN SỬ DỤNG SCRIPT KIỂM THỬ ===
1. Trước tiên, đăng nhập vào hệ thống và lấy token admin
2. Thay đổi giá trị "adminToken" trong script này
3. Điều chỉnh ID sản phẩm trong hàm createOrderWithProductLinks() nếu cần
4. Chạy script bằng Node.js: node test_order_product_api.js
5. Kiểm tra kết quả trong console
`);

// Bỏ comment dòng dưới để chạy tất cả các test
// runTests();
