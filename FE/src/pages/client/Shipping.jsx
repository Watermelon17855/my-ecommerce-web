import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from "../../context/CartContext";
import { User, Phone, MapPin, CreditCard, Wallet, Sparkles, ChevronRight } from 'lucide-react';

const Shipping = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchCart } = useCart();
    const { cartItems, totalPrice } = location.state || { cartItems: [], totalPrice: 0 };

    const [paymentMethod, setPaymentMethod] = useState('transfer');
    const [formData, setFormData] = useState({ fullname: '', phone: '', address: '' });

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id || user?.id;

        const orderPayload = {
            userId,
            ...formData,
            items: cartItems,
            totalAmount: totalPrice,
            paymentMethod: paymentMethod
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderPayload),
            });

            if (response.ok) {
                const savedOrder = await response.json();

                if (paymentMethod === 'transfer') {
                    navigate('/checkout', { state: { orderData: savedOrder } });
                } else {
                    const clearRes = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/clear/${userId}`, {
                        method: 'DELETE'
                    });

                    if (clearRes.ok) {
                        await fetchCart();
                        alert("🎉 Đặt hàng thành công! Đơn hàng sẽ được thanh toán khi nhận hàng.");
                        navigate('/');
                    }
                }
            }
        } catch (error) {
            console.error("Lỗi đặt hàng COD:", error);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 relative z-10">
            {/* Header trang Shipping: Đen đậm & Thanh lịch */}
            <div className="max-w-5xl mx-auto flex items-center gap-4 mb-12">
                <div className="h-10 w-1.5 bg-blue-600 rounded-full shadow-sm"></div>
                <h1 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase">
                    Giao hàng <span className="text-blue-600">& Thanh toán</span>
                </h1>
            </div>

            <form onSubmit={handleConfirmOrder} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* --- KHỐI THÔNG TIN NHẬN HÀNG (Bên trái) --- */}
                <div className="space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <User className="text-blue-600" size={20} />
                        </div>
                        <h2 className="font-black text-gray-900 uppercase text-xs tracking-widest italic">Thông tin người nhận</h2>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ và tên</label>
                            <input
                                required
                                type="text"
                                placeholder="Nhập họ tên..."
                                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-gray-900 placeholder:text-gray-300 outline-none focus:bg-white focus:border-blue-600/20 transition-all"
                                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                            <input
                                required
                                type="tel"
                                placeholder="Số điện thoại nhận hàng..."
                                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-gray-900 placeholder:text-gray-300 outline-none focus:bg-white focus:border-blue-600/20 transition-all"
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ giao hàng</label>
                            <textarea
                                required
                                placeholder="Số nhà, tên đường, phường/xã..."
                                rows="4"
                                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-gray-900 placeholder:text-gray-300 outline-none focus:bg-white focus:border-blue-600/20 transition-all resize-none"
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* --- KHỐI PHƯƠNG THỨC THANH TOÁN (Bên phải) --- */}
                <div className="space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-md flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <CreditCard className="text-blue-600" size={20} />
                            </div>
                            <h2 className="font-black text-gray-900 uppercase text-xs tracking-widest italic">Phương thức thanh toán</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Chuyển khoản */}
                            <label className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${paymentMethod === 'transfer' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-50 bg-gray-50 hover:bg-gray-100'}`}>
                                <input type="radio" name="payment" value="transfer" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="hidden" />
                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-blue-600' : 'border-gray-300'}`}>
                                    {paymentMethod === 'transfer' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-black text-sm uppercase ${paymentMethod === 'transfer' ? 'text-gray-900' : 'text-gray-500'}`}>Chuyển khoản online</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Quét mã QR qua ứng dụng ngân hàng</p>
                                </div>
                                <Wallet className={paymentMethod === 'transfer' ? 'text-blue-600' : 'text-gray-300'} size={24} />
                            </label>

                            {/* Tiền mặt */}
                            <label className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-50 bg-gray-50 hover:bg-gray-100'}`}>
                                <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="hidden" />
                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-blue-600' : 'border-gray-300'}`}>
                                    {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-black text-sm uppercase ${paymentMethod === 'cash' ? 'text-gray-900' : 'text-gray-500'}`}>Thanh toán COD</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Nhận hàng rồi mới trả tiền</p>
                                </div>
                                <Sparkles className={paymentMethod === 'cash' ? 'text-blue-600' : 'text-gray-300'} size={24} />
                            </label>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 mt-8">
                        <div className="flex justify-between items-end mb-8">
                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Tổng tiền thanh toán</span>
                            <span className="font-black text-3xl text-blue-600 tracking-tighter">
                                {totalPrice.toLocaleString()}đ
                            </span>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gray-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            {paymentMethod === 'transfer' ? 'Tiến hành thanh toán' : 'Xác nhận đơn hàng'}
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Shipping;