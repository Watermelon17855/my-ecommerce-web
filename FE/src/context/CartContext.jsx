import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // --- 1. LẤY GIỎ HÀNG TỪ DB ---
    const fetchCart = async () => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            setCartItems([]);
            return;
        }
        const user = JSON.parse(userData);
        const userId = user._id || user.id;

        if (userId) {
            try {
                const response = await fetch(`http://localhost:5001/api/cart/${userId}`);
                const data = await response.json();
                if (response.ok && data && data.products) {
                    const formattedCart = data.products
                        .filter(item => item.productId !== null)
                        .map(item => ({
                            ...item.productId,
                            quantity: item.quantity,
                            _id: item.productId._id
                        }));
                    setCartItems(formattedCart);
                }
            } catch (error) {
                console.error("Lỗi lấy giỏ hàng:", error);
            }
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // --- 2. THÊM VÀO GIỎ HÀNG (Dùng API /add) ---
    const addToCart = async (product) => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert("Vui lòng đăng nhập để mua hàng!");
            return;
        }
        const user = JSON.parse(userData);
        const userId = user._id || user.id;

        try {
            const response = await fetch('http://localhost:5001/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId: product._id, quantity: 1 }),
            });

            if (response.ok) {
                setCartItems(prev => {
                    const exist = prev.find(x => x._id === product._id);
                    if (exist) {
                        return prev.map(x => x._id === product._id ? { ...exist, quantity: exist.quantity + 1 } : x);
                    }
                    return [...prev, { ...product, quantity: 1 }];
                });
            }
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    // --- 3. XÓA VĨNH VIỄN SẢN PHẨM (Nút xọt rác - Dùng API DELETE) ---
    const removeFromCart = async (productId) => {
        const userData = localStorage.getItem('user');
        if (!userData) return;
        const user = JSON.parse(userData);
        const userId = user._id || user.id;

        try {
            const response = await fetch(`http://localhost:5001/api/cart/remove/${userId}/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Xóa trên giao diện sau khi DB đã xóa xong
                setCartItems((prev) => prev.filter((item) => item._id !== productId));
                console.log("Đã xóa vĩnh viễn sản phẩm khỏi Database");
            }
        } catch (error) {
            console.error("Lỗi xóa sản phẩm:", error);
        }
    };

    // --- 4. CẬP NHẬT SỐ LƯỢNG (Nút trừ - Dùng API /add hoặc /decrease) ---
    const updateQuantity = async (productId, amount) => {
        if (amount !== -1) return;

        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?._id || userData?.id;

        try {
            const response = await fetch('http://localhost:5001/api/cart/decrease', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId }),
            });

            if (response.ok) {
                // Cập nhật giao diện
                setCartItems((prev) =>
                    prev.map((item) =>
                        item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
                    )
                );
            }
        } catch (error) {
            console.error("Lỗi giảm số lượng:", error);
        }
    };
    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);