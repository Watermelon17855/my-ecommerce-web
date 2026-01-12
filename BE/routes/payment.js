const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. API TẠO ĐƠN HÀNG (Dùng khi khách nhấn "Thanh toán")
router.post('/create-order', async (req, res) => {
    const { userId, items, totalAmount } = req.body;
    const orderCode = `ORD${Date.now()}`; // Tạo mã duy nhất dựa trên thời gian

    try {
        const newOrder = await Order.create({
            userId,
            items,
            totalAmount,
            orderCode,
            paymentStatus: 'pending'
        });
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. WEBHOOK NHẬN DỮ LIỆU TỪ SEPAY
router.post('/sepay-webhook', async (req, res) => {
    console.log("Dữ liệu SePay gửi tới:", req.body); // Quan trọng: Xem log trên Render để biết SePay gửi gì
    const { content, transferAmount } = req.body;

    try {
        // Thêm cờ 'i' để không phân biệt ORD hay ord
        const orderCodeMatch = content.match(/ORD\d+/i);
        const orderCode = orderCodeMatch ? orderCodeMatch[0].toUpperCase() : null; // Chuyển về hoa để khớp DB

        if (orderCode) {
            const order = await Order.findOne({ orderCode });
            console.log("Tìm thấy đơn hàng trong DB:", order);

            if (order && order.paymentStatus === 'pending' && transferAmount >= order.totalAmount) {
                order.paymentStatus = 'paid';
                await order.save();
                console.log("Cập nhật trạng thái PAID thành công!");
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