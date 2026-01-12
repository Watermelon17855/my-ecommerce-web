import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_URL = "https://my-ecommerce-web-rlmf.onrender.com";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('pending');

    // Lấy dữ liệu từ state được truyền sang
    const orderData = location.state?.orderData;

    // 1. Kiểm tra nếu không có dữ liệu đơn hàng thì không cho vào trang này
    useEffect(() => {
        if (!orderData) {
            alert("Không tìm thấy thông tin đơn hàng. Vui lòng thử lại!");
            navigate('/cart'); // Quay lại giỏ hàng
        }
    }, [orderData, navigate]);

    // Nếu đang redirect hoặc thiếu dữ liệu thì không render nội dung bên dưới
    if (!orderData) return <div className="text-center p-10">Đang tải dữ liệu đơn hàng...</div>;

    // 2. Tạo Link QR SePay
    const qrUrl = `https://qr.sepay.vn/img?acc=0388100173&bank=VPBank&amount=${orderData.totalAmount}&des=${orderData.orderCode}`;

    useEffect(() => {
        if (status === 'paid') return;

        const checkInterval = setInterval(async () => {
            try {
                const res = await fetch(`${API_URL}/api/payment/check-status/${orderData.orderCode}`);
                const data = await res.json();

                if (data.status === 'paid') {
                    setStatus('paid');
                    clearInterval(checkInterval);
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
                    <div className="bg-white p-4 inline-block rounded-2xl shadow-sm border">
                        <img src={qrUrl} alt="QR Thanh toán" className="mx-auto rounded-xl" />
                    </div>
                    <p className="mt-4 text-lg">Số tiền: <b className="text-red-600">{orderData.totalAmount.toLocaleString()} VNĐ</b></p>
                    <p className="mt-2 text-gray-600">Nội dung chuyển khoản: <b>{orderData.orderCode}</b></p>
                    <div className="mt-6 animate-pulse text-blue-500 font-medium">🔄 Hệ thống đang chờ bạn thanh toán...</div>
                </>
            ) : (
                <div className="bg-green-100 p-10 rounded-3xl max-w-md mx-auto">
                    <h2 className="text-5xl mb-4">🎉</h2>
                    <h2 className="text-2xl font-bold text-green-700">Thanh toán thành công!</h2>
                    <p className="text-green-600 mt-2">Đơn hàng của bạn đang được xử lý.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all"
                    >
                        Quay về trang chủ
                    </button>
                </div>
            )}
        </div>
    );
};

export default Checkout;