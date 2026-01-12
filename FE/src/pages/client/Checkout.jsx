import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from "../../context/CartContext";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderData } = location.state || {};
    const [status, setStatus] = useState('pending');
    const { fetchCart } = useCart();

    useEffect(() => {
        // Nếu không có mã đơn hàng thì không làm gì cả
        if (!orderData?.orderCode) return;

        // Thiết lập đồng hồ kiểm tra mỗi 3 giây (Polling)
        const checkInterval = setInterval(async () => {
            try {
                // Gọi API bạn đã viết để kiểm tra trạng thái
                const response = await fetch(`https://my-ecommerce-web-rlmf.onrender.com/api/payment/check-paymentStatus/${orderData.orderCode}`);
                const data = await response.json();

                if (data.paymentStatus === 'paid') {
                    setStatus('paid');
                    clearInterval(checkInterval); // Dừng kiểm tra khi đã thấy 'paid'

                    // --- THÊM LOGIC XÓA GIỎ HÀNG TẠI ĐÂY ---
                    try {
                        // 1. Gọi API xóa giỏ hàng trong Database
                        await fetch(`https://my-ecommerce-web-rlmf.onrender.com/api/cart/clear/${orderData.userId}`, {
                            method: 'DELETE',
                        });

                        // 2. Cập nhật lại giỏ hàng ở Frontend (để số 1 trên icon giỏ hàng mất đi)
                        await fetchCart();

                        console.log("Giỏ hàng đã được làm trống thành công!");
                    } catch (error) {
                        console.error("Lỗi khi dọn dẹp giỏ hàng:", error);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra trạng thái:", error);
            }
        }, 3000); // 3 giây kiểm tra 1 lần

        return () => clearInterval(checkInterval); // Xóa đồng hồ khi thoát trang
    }, [orderData]);


    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            {status === 'paid' ? (
                // Giao diện khi thanh toán THÀNH CÔNG
                <div className="bg-white p-10 rounded-3xl shadow-2xl border border-green-100 animate-in fade-in zoom-in duration-500">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-3xl font-bold text-green-600 mb-2">Thanh toán thành công!</h1>
                    <p className="text-gray-600">Cảm ơn bạn đã mua hàng. Đơn hàng {orderData.orderCode} đang được xử lý.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-8 bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            ) : (
                // Giao diện khi ĐANG CHỜ thanh toán
                <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 italic">Quét mã để thanh toán 💳</h2>
                    <img
                        src={`https://qr.sepay.vn/img?acc=0388100173&bank=VPBank&amount=${orderData?.totalAmount}&des=${orderData?.orderCode}`}
                        alt="QR Thanh toán"
                        className="mx-auto w-64 h-64 object-contain mb-6"
                    />
                    <div className="space-y-2 text-sm text-gray-500">
                        <p>Số tiền: <span className="font-bold text-red-500">{orderData?.totalAmount?.toLocaleString()}đ</span></p>
                        <p>Nội dung: <span className="font-bold text-blue-600">{orderData?.orderCode}</span></p>
                    </div>
                    <div className="mt-8 flex items-center justify-center space-x-2 text-blue-600 font-medium">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <p className="animate-pulse">Đang chờ hệ thống xác nhận...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;