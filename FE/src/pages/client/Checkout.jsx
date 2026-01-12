import { useState, useEffect } from 'react';

const API_URL = "https://my-ecommerce-web-rlmf.onrender.com"; // Link Render của bạn

const Checkout = ({ orderData }) => {
    const [status, setStatus] = useState('pending');

    // 1. Tạo Link QR SePay (Thay STK và Ngân hàng của bạn vào đây)
    const qrUrl = `https://qr.sepay.vn/img?acc=0388100173&bank=VPBank&amount=${orderData.totalAmount}&des=${orderData.orderCode}`;

    useEffect(() => {
        if (status === 'paid') return;

        // 2. Cứ mỗi 3 giây gọi API hỏi xem đã nhận được tiền chưa
        const checkInterval = setInterval(async () => {
            try {
                const res = await fetch(`${API_URL}/api/payment/check-status/${orderData.orderCode}`);
                const data = await res.json();

                if (data.status === 'paid') {
                    setStatus('paid');
                    clearInterval(checkInterval); // Dừng hỏi khi đã trả tiền
                }
            } catch (err) {
                console.error("Lỗi kiểm tra:", err);
            }
        }, 3000);

        return () => clearInterval(checkInterval);
    }, [orderData.orderCode, status]);

    return (
        <div className="text-center p-10">
            {status === 'pending' ? (
                <>
                    <h2 className="text-2xl font-bold mb-4">Quét mã để thanh toán 💳</h2>
                    <img src={qrUrl} alt="QR Thanh toán" className="mx-auto border-4 border-gray-100 rounded-xl" />
                    <p className="mt-4 text-gray-600">Nội dung chuyển khoản: <b>{orderData.orderCode}</b></p>
                    <div className="mt-4 animate-pulse text-blue-500">Đang chờ bạn thanh toán...</div>
                </>
            ) : (
                <div className="bg-green-100 p-10 rounded-3xl">
                    <h2 className="text-4xl">🎉</h2>
                    <h2 className="text-2xl font-bold text-green-700">Thanh toán thành công!</h2>
                    <p>Đơn hàng của bạn đang được xử lý.</p>
                    <button onClick={() => window.location.href = '/'} className="mt-6 bg-green-600 text-white px-6 py-2 rounded-full">Quay về trang chủ</button>
                </div>
            )}
        </div>
    );
};

export default Checkout;