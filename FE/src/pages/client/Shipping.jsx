import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from "../../context/CartContext"; // Để xóa giỏ hàng nếu chọn tiền mặt

const Shipping = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchCart } = useCart();
    const { cartItems, totalPrice } = location.state || { cartItems: [], totalPrice: 0 };

    const [paymentMethod, setPaymentMethod] = useState('transfer'); // Mặc định là chuyển khoản
    const [formData, setFormData] = useState({ fullname: '', phone: '', address: '' });

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            const response = await fetch("https://my-ecommerce-web-rlmf.onrender.com/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user._id,
                    ...formData,
                    items: cartItems,
                    totalAmount: totalPrice,
                    paymentMethod: paymentMethod // Gửi phương thức đã chọn
                }),
            });

            if (response.ok) {
                const savedOrder = await response.json();

                // LOGIC RẼ NHÁNH TẠI ĐÂY
                if (paymentMethod === 'transfer') {
                    // Nếu là chuyển khoản -> Qua trang quét mã QR
                    navigate('/checkout', { state: { orderData: savedOrder } });
                } else {
                    // Nếu là tiền mặt -> Thông báo thành công & Xóa giỏ hàng luôn
                    await fetch(`https://my-ecommerce-web-rlmf.onrender.com/api/cart/clear/${user._id}`, { method: 'DELETE' });
                    await fetchCart(); // Cập nhật icon giỏ hàng về 0
                    alert("🎉 Cảm ơn bạn đã đặt hàng! Đơn hàng sẽ được thanh toán khi nhận hàng (COD).");
                    navigate('/'); // Quay về trang chủ
                }
            }
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">Thông tin giao hàng & Thanh toán</h1>
            <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Thông tin nhận hàng */}
                <div className="space-y-4 bg-white p-6 rounded-2xl border">
                    <h2 className="font-bold text-lg mb-4">Người nhận</h2>
                    <input required type="text" placeholder="Họ tên" name="fullname" className="w-full p-3 border rounded-xl" onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
                    <input required type="tel" placeholder="Số điện thoại" name="phone" className="w-full p-3 border rounded-xl" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    <textarea required placeholder="Địa chỉ chi tiết" name="address" className="w-full p-3 border rounded-xl" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>

                {/* Phương thức thanh toán */}
                <div className="space-y-4 bg-white p-6 rounded-2xl border">
                    <h2 className="font-bold text-lg mb-4">Hình thức thanh toán</h2>

                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-blue-500 bg-blue-50' : ''}`}>
                        <input type="radio" name="payment" value="transfer" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="mr-3" />
                        <div>
                            <p className="font-bold">Chuyển khoản ngân hàng</p>
                            <p className="text-xs text-gray-500">Quét mã QR qua SePay</p>
                        </div>
                    </label>

                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : ''}`}>
                        <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="mr-3" />
                        <div>
                            <p className="font-bold">Tiền mặt (COD)</p>
                            <p className="text-xs text-gray-500">Thanh toán khi nhận hàng</p>
                        </div>
                    </label>

                    <div className="pt-4 border-t mt-4">
                        <div className="flex justify-between font-bold text-xl text-blue-600 mb-4">
                            <span>Tổng:</span>
                            <span>{totalPrice.toLocaleString()}đ</span>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-800">
                            {paymentMethod === 'transfer' ? 'Tiếp tục thanh toán' : 'Xác nhận đặt hàng'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Shipping;