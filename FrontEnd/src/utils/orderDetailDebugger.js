/**
 * OrderDetail Debugger Utility
 * 
 * Công cụ giúp kiểm tra và debug các vấn đề liên quan đến mối quan hệ
 * giữa OrderDetail và Product trong ứng dụng NatureGrain
 */

/**
 * Kiểm tra và phân tích chi tiết đơn hàng
 * @param {Object} order - Đơn hàng cần kiểm tra
 * @returns {Object} - Kết quả phân tích
 */
export const analyzeOrderDetails = (order) => {
  if (!order) {
    console.error('analyzeOrderDetails: Order is null or undefined');
    return {
      success: false,
      message: 'Đơn hàng không tồn tại',
      data: null
    };
  }

  try {
    // Lấy chi tiết đơn hàng
    const orderDetails = order.orderDetails || [];
    
    // Phân loại chi tiết đơn hàng
    const detailsWithProduct = orderDetails.filter(detail => detail.product);
    const detailsWithoutProduct = orderDetails.filter(detail => !detail.product);
    
    // Tính tổng tiền chính xác
    const calculatedTotal = orderDetails.reduce(
      (sum, item) => sum + (item.subTotal || (item.price * item.quantity)), 
      0
    );
    
    // So sánh với tổng tiền đơn hàng
    const totalPriceMatch = calculatedTotal === order.totalPrice;
    
    // Kết quả phân tích
    const result = {
      success: true,
      orderId: order.id,
      orderDate: order.createAt,
      orderStatus: order.status,
      totalItems: orderDetails.length,
      detailsWithProduct: detailsWithProduct.length,
      detailsWithoutProduct: detailsWithoutProduct.length,
      calculatedTotal,
      reportedTotal: order.totalPrice,
      totalPriceMatch,
      detailsWithoutProductList: detailsWithoutProduct,
      message: totalPriceMatch 
        ? 'Tổng tiền đơn hàng khớp với tổng chi tiết' 
        : 'Tổng tiền đơn hàng không khớp với chi tiết'
    };
    
    console.log('Order analysis result:', result);
    return result;
    
  } catch (error) {
    console.error('Error analyzing order details:', error);
    return {
      success: false,
      message: 'Lỗi khi phân tích đơn hàng',
      error: error.message
    };
  }
};

/**
 * Format thông tin sản phẩm từ chi tiết đơn hàng
 * @param {Object} orderDetail - Chi tiết đơn hàng
 * @returns {String} - Thông tin sản phẩm được format
 */
export const formatProductInfo = (orderDetail) => {
  if (!orderDetail) return 'N/A';
  
  const product = orderDetail.product;
  
  if (product) {
    return `${orderDetail.name} (ID: ${product.id})`;
  } else {
    return `${orderDetail.name} (Không liên kết với sản phẩm)`;
  }
};

/**
 * Hiển thị log debug chi tiết đơn hàng
 * @param {Object} order - Đơn hàng cần debug
 */
export const debugOrderDetails = (order) => {
  if (!order) {
    console.error('debugOrderDetails: Order is null or undefined');
    return;
  }
  
  console.group(`Debug Order #${order.id}`);
  console.log('Order:', order);
  
  const orderDetails = order.orderDetails || [];
  console.log(`Order Details: ${orderDetails.length} items`);
  
  orderDetails.forEach((detail, index) => {
    console.group(`Detail #${index + 1}: ${detail.name}`);
    console.log('ID:', detail.id);
    console.log('Price:', detail.price);
    console.log('Quantity:', detail.quantity);
    console.log('SubTotal:', detail.subTotal);
    console.log('Product Reference:', detail.product ? `ID: ${detail.product.id}` : 'NULL');
    console.groupEnd();
  });
  
  console.groupEnd();
};

export default {
  analyzeOrderDetails,
  formatProductInfo,
  debugOrderDetails
};
