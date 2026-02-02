const nodemailer = require('nodemailer');

const sendOrderNotification = async (orderData) => {
    console.log("===> Bước 1: Hàm sendOrderNotification đã bắt đầu chạy!");

    const email = process.env.ADMIN_EMAIL;
    const pass = process.env.ADMIN_APP_PASSWORD;

    if (!email || !pass) {
        console.error("❌ LỖI: Thiếu config trong .env!");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: email, pass: pass }
    });

    const mailOptions = {
        from: `"Hệ Thống MERN Shop" <${email}>`,
        to: email,
        subject: `🔔 ĐƠN HÀNG MỚI: #${orderData.orderCode || 'N/A'}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
                <h2 style="color: #2563eb; text-align: center;">Sếp ơi, chốt đơn mới! 🚀</h2>
                <div style="background: #f8fafc; padding: 15px; border-radius: 10px;">
                    <p><strong>Khách hàng:</strong> ${orderData.fullname || 'Khách vãng lai'}</p>
                    <p><strong>Số điện thoại:</strong> ${orderData.phone || 'N/A'}</p>
                    <p><strong>Địa chỉ:</strong> ${orderData.address || 'N/A'}</p>
                    <p><strong>Phương thức:</strong> ${orderData.paymentMethod || 'Chưa chọn'}</p>
                </div>
                <h3 style="color: #2563eb; text-align: right;">Tổng tiền: ${(orderData.totalAmount || 0).toLocaleString()}đ</h3>
                <p style="font-size: 12px; color: #999; text-align: center;">Vào Admin xử lý ngay sếp nhé!</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("===> Bước 4: Email báo đơn hàng đã bay đi! Ting ting 💸");
    } catch (error) {
        console.error("===> ❌ LỖI GỬI MAIL:", error.message);
    }
};

module.exports = sendOrderNotification;