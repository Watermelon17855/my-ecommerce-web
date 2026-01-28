import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // --- HÀM BỔ TRỢ: Chuẩn hóa dữ liệu giỏ hàng ---
    // Giúp biến dữ liệu từ [{productId: {...}, quantity: 1}] thành [{_id: ..., name: ..., quantity: 1}]
    const formatCartData = (products) => {
        if (!products) return [];
        return products
            .filter(item => item.productId !== null) // Loại bỏ SP đã bị xóa khỏi DB
            .map(item => ({
                ...item.productId, // Lấy name, price, img, _id từ productId
                quantity: item.quantity,
                _id: item.productId._id // Đảm bảo _id là của sản phẩm
            }));
    };

    // --- 1. LẤY GIỎ HÀNG TỪ DB ---
    const fetchCart = async () => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            setCartItems([]);
            return;
        }
        const user = JSON.parse(userData);
        const userId = user._id || user.id;

        try {
            const response = await fetch(`${API_URL}/api/cart/${userId}`);
            const data = await response.json();
            if (response.ok && data && data.products) {
                setCartItems(formatCartData(data.products)); // Dùng hàm chuẩn hóa
            }
        } catch (error) {
            console.error("Lỗi lấy giỏ hàng:", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // --- 2. THÊM VÀO GIỎ HÀNG ---
    const addToCart = async (product) => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert("Vui lòng đăng nhập để mua hàng!");
            return;
        }
        const user = JSON.parse(userData);
        const userId = user._id || user.id;

        try {
            const response = await fetch(`${API_URL}/api/cart/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId: product._id, quantity: 1 }),
            });

            if (response.ok) {
                // Sau khi thêm thành công, gọi lại fetchCart để đồng bộ dữ liệu chuẩn nhất từ Server
                fetchCart();
            }
        } catch (error) {
            console.error("Lỗi thêm giỏ hàng:", error);
        }
    };

    // --- 3. XÓA SẢN PHẨM ---
    const removeFromCart = async (productId) => {
        const userData = localStorage.getItem('user');
        if (!userData) return;
        const user = JSON.parse(userData);
        const userId = user._id || user.id;

        try {
            const res = await fetch(`${API_URL}/api/cart/remove/${userId}/${productId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                const data = await res.json();
                // QUAN TRỌNG: Phải chuẩn hóa lại dữ liệu sau khi xóa
                setCartItems(formatCartData(data.products));
            }
        } catch (err) { console.error("Lỗi xóa:", err); }
    };

    // --- 4. CẬP NHẬT SỐ LƯỢNG ---
    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const userData = localStorage.getItem('user');
        if (!userData) return;
        const user = JSON.parse(userData);
        const userId = user._id || user.id;

        try {
            const res = await fetch(`${API_URL}/api/cart/update-quantity`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId, quantity: newQuantity })
            });
            if (res.ok) {
                const data = await res.json();
                // QUAN TRỌNG: Phải chuẩn hóa lại dữ liệu sau khi cập nhật
                setCartItems(formatCartData(data.products));
            }
        } catch (err) { console.error("Lỗi cập nhật:", err); }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);