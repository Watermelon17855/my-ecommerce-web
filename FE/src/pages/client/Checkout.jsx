import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from "../../context/CartContext";
import { CheckCircle, CreditCard, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderData } = location.state || {};
    const [status, setStatus] = useState('pending');
    const { fetchCart } = useCart();

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    useEffect(() => {
        if (!orderData?.orderCode) return;

        const checkInterval = setInterval(async () => {
            try {
                const response = await fetch(`${API_URL}/api/payment/check-paymentStatus/${orderData.orderCode}`);
                const data = await response.json();

                if (data.paymentStatus === 'paid') {
                    setStatus('paid');
                    clearInterval(checkInterval);

                    try {
                        await fetch(`${API_URL}/api/cart/clear/${orderData.userId}`, {
                            method: 'DELETE',
                        });
                        await fetchCart();
                    } catch (error) {
                        console.error("Lỗi khi dọn dẹp giỏ hàng:", error);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra trạng thái:", error);
            }
        }, 3000);

        return () => clearInterval(checkInterval);
    }, [orderData, API_URL, fetchCart]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Decor nhẹ nhàng phía sau */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent"></div>

            {status === 'paid' ? (
                // --- GIAO DIỆN THÀNH CÔNG (White & Green) ---
                <div className="relative z-10 w-full max-w-lg bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-green-100 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CheckCircle size={48} className="text-green-500" />
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 mb-4 italic tracking-tighter uppercase">
                        Giao dịch <span className="text-green-600">Thành công!</span>
                    </h1>
                    <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                        Hệ thống đã xác nhận thanh toán. <br />
                        Mã đơn hàng <span className="text-gray-900 font-bold">#{orderData?.orderCode}</span> đang được chuẩn bị.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-gray-900 hover:bg-green-600 text-white py-5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            VỀ TRANG CHỦ <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            ) : (
                // --- GIAO DIỆN CHỜ THANH TOÁN (White Minimalism) ---
                <div className="relative z-10 w-full max-w-md bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl border border-gray-100 text-center">

                    <div className="flex items-center justify-center gap-2 mb-8 text-blue-600">
                        <ShieldCheck size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cổng thanh toán bảo mật</span>
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 mb-8 italic tracking-tighter uppercase">Quét mã QR</h2>

                    {/* KHUNG QR LUXURY */}
                    <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 mb-8 relative group">
                        <img
                            src={`https://qr.sepay.vn/img?acc=0388100173&bank=VPBank&amount=${orderData?.totalAmount}&des=${orderData?.orderCode}`}
                            alt="QR Thanh toán"
                            className="mx-auto w-full h-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 border-2 border-blue-600/5 rounded-[2.5rem] pointer-events-none"></div>
                    </div>

                    {/* CHI TIẾT ĐƠN HÀNG */}
                    <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-100 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 font-bold uppercase text-[10px]">Số tiền</span>
                            <span className="text-red-500 font-black text-xl tracking-tight">
                                {orderData?.totalAmount?.toLocaleString()}đ
                            </span>
                        </div>
                        <div className="h-px bg-gray-200/50 w-full" />
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 font-bold uppercase text-[10px]">Nội dung</span>
                            <span className="text-blue-600 font-black tracking-widest uppercase">
                                {orderData?.orderCode}
                            </span>
                        </div>
                    </div>

                    {/* TRẠNG THÁI POLLING */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-full text-blue-600">
                            <RefreshCw size={16} className="animate-spin" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Đang chờ xác thực...</span>
                        </div>
                        <p className="text-[10px] text-gray-400 italic">Vui lòng không tắt trình duyệt cho đến khi có thông báo thành công.</p>
                    </div>
                </div>
            )}

            {/* Chân trang đơn giản */}
            <div className="mt-10 text-gray-300 flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                <span>Secure Payment</span>
                <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                <span>SePay Verified</span>
            </div>
        </div>
    );
};

export default Checkout;