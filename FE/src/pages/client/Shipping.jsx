import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Shipping = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Nhận dữ liệu giỏ hàng từ trang Cart truyền sang
    const { cartItems, totalPrice } = location.state || { cartItems: [], totalPrice: 0 };

    const [formData, setFormData] = useState({
        fullname: '',
        phone: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        const userData = localStorage.getItem('user');
        if (!userData) return alert("Vui lòng đăng nhập lại!");
        const user = JSON.parse(userData);

        try {
            // Gửi dữ liệu lên Backend để tạo đơn hàng chính thức
            const response = await fetch("https://my-ecommerce-web-rlmf.onrender.com/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user._id, // Lấy ID người dùng từ localStorage
                    fullname: formData.fullname,
                    phone: formData.phone,
                    address: formData.address,
                    items: cartItems,
                    totalAmount: totalPrice,
                }),
            });

            if (response.ok) {
                const savedOrder = await response.json();
                // ✅ CHUYỂN TRANG: Sau khi có đơn hàng trong DB, qua trang quét QR
                navigate('/checkout', { state: { orderData: savedOrder } });
            } else {
                alert("Lỗi khi tạo đơn hàng, vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cột 1: Form điền thông tin */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border h-fit">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Thông tin giao hàng 🚚</h1>
                <form onSubmit={handleConfirmOrder} className="space-y-4">
                    <input
                        required name="fullname" type="text" placeholder="Họ và tên người nhận"
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={handleChange}
                    />
                    <input
                        required name="phone" type="tel" placeholder="Số điện thoại"
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={handleChange}
                    />
                    <textarea
                        required name="address" rows="3" placeholder="Địa chỉ nhận hàng chi tiết..."
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={handleChange}
                    ></textarea>

                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                        Xác nhận & Thanh toán
                    </button>
                </form>
            </div>

            {/* Cột 2: Tóm tắt đơn hàng */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-dashed border-gray-300">
                <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
                <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
                    {cartItems.map(item => (
                        <div key={item._id} className="flex justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span className="font-medium">{(item.price * item.quantity).toLocaleString()}đ</span>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg text-blue-600">
                    <span>Tổng tiền:</span>
                    <span>{totalPrice.toLocaleString()}đ</span>
                </div>
            </div>
        </div>
    );
};

export default Shipping;