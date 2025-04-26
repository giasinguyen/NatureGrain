import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Tải giỏ hàng từ localStorage khi component được mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Lỗi khi đọc giỏ hàng từ localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Cập nhật localStorage và tính toán lại tổng khi cartItems thay đổi
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cart');
    }

    // Tính toán tổng số lượng và tổng giá trị
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setCartCount(itemCount);
    setCartTotal(totalPrice);
  }, [cartItems]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id
      );

      let updatedItems;

      if (existingItemIndex >= 0) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        toast.info(`Đã cập nhật số lượng ${product.name} trong giỏ hàng`);
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
        updatedItems = [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
          },
        ];
        toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
      }

      return updatedItems;
    });
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId) => {
    const productToRemove = cartItems.find(item => item.id === productId);
    
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== productId);
      if (productToRemove) {
        toast.info(`Đã xóa ${productToRemove.name} khỏi giỏ hàng`);
      }
      return updatedItems;
    });
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    toast.info('Đã xóa toàn bộ giỏ hàng');
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;