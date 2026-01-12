const Checkout = ({ totalAmount, orderCode }) => {
    // Thông tin ngân hàng của bạn
    const MY_BANK = {
        BANK_ID: "MB", // Ví dụ Quân Đội MBBank
        ACCOUNT_NO: "123456789",
        ACCOUNT_NAME: "NGUYEN VAN A"
    };

    // Link tạo QR tự động theo chuẩn VietQR
    const qrUrl = `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact2.png?amount=${totalAmount}&addInfo=${orderCode}&accountName=${MY_BANK.ACCOUNT_NAME}`;

    return (
        <div className="text-center p-10 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Quét mã để thanh toán</h2>
            <img src={qrUrl} alt="QR Thanh Toan" className="mx-auto w-64 h-64 border p-2" />
            <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg">
                <p>Nội dung chuyển khoản: <span className="font-bold text-red-600">{orderCode}</span></p>
                <p className="text-sm font-medium mt-1">(Vui lòng ghi đúng nội dung để hệ thống tự động xác nhận)</p>
            </div>
        </div>
    );
};