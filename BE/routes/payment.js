const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// 1. API TẠO ĐƠN HÀNG (Dùng khi khách nhấn "Thanh toán")
router.post('/create-order', async (req, res) => {
    // Nhận thêm fullname, phone, address từ Frontend gửi lên
    const { userId, items, totalAmount, fullname, phone, address } = req.body;
    const orderCode = `ORD${Date.now()}`;

    try {
        const newOrder = await Order.create({
            userId,
            fullname,
            phone,
            address,
            items,
            totalAmount,
            orderCode,
        });
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. WEBHOOK NHẬN DỮ LIỆU TỪ SEPAY
router.post('/sepay-webhook', async (req, res) => {
    console.log("Dữ liệu SePay gửi tới:", req.body);
    const { content, transferAmount } = req.body;

    try {
        const orderCodeMatch = content.match(/ORD\d+/i);
        const orderCode = orderCodeMatch ? orderCodeMatch[0].toUpperCase() : null;

        if (orderCode) {
            const order = await Order.findOne({ orderCode });

            if (order && order.paymentStatus === 'pending' && transferAmount >= order.totalAmount) {
                // CẬP NHẬT ĐƠN HÀNG
                order.paymentStatus = 'paid';
                await order.save();

                // --- ĐÂY LÀ CHỖ QUAN TRỌNG: XÓA GIỎ HÀNG NGAY LẬP TỨC ---
                // Vì trong đơn hàng (order) đã có lưu userId rồi
                await Cart.deleteMany({ userId: order.userId });

                console.log(`✅ Đã thanh toán & Xóa giỏ hàng cho user: ${order.userId}`);
                return res.status(200).json({ success: true });
            }
        }
        res.status(200).json({ message: "Chưa khớp đơn hàng hoặc điều kiện" });
    } catch (err) {
        console.error("Lỗi Webhook:", err);
        res.status(500).send("Lỗi xử lý server");
    }
});

// 3. API KIỂM TRA TRẠNG THÁI ĐƠN HÀNG (Dùng cho FE gọi liên tục)
router.get('/check-paymentStatus/:orderCode', async (req, res) => {
    try {
        const order = await Order.findOne({ orderCode: req.params.orderCode });
        res.json({ paymentStatus: order ? order.paymentStatus : 'not_found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;