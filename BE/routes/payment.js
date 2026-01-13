const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { isAdmin } = require('../middleware/authMiddleware');

// routes/admin.js hoặc paymentRoutes.js

router.get('/revenue-chart', isAdmin, async (req, res) => {
    try {
        const { from, to } = req.query;

        // Chuyển đổi string sang Date object
        const startDate = new Date(from);
        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999); // Lấy đến cuối ngày của ngày kết thúc

        const revenueData = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "paid",
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        method: "$paymentMethod"
                    },
                    total: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id.date": 1 } }
        ]);

        // Format lại dữ liệu để Recharts dễ đọc: 
        // Từ [{_id: {date: '2026-01-13', method: 'cash'}, total: 500}, ...]
        // Thành [{date: '2026-01-13', cash: 500, transfer: 1000}, ...]
        const formattedData = {};
        revenueData.forEach(item => {
            const date = item._id.date;
            const method = item._id.method === 'transfer' ? 'transfer' : 'cash';

            if (!formattedData[date]) {
                formattedData[date] = { date, cash: 0, transfer: 0 };
            }
            formattedData[date][method] = item.total;
        });

        res.status(200).json(Object.values(formattedData));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API lấy tất cả đơn hàng cho Admin
router.get('/all-orders', isAdmin, async (req, res) => {
    try {
        // Lấy tất cả, sắp xếp đơn mới nhất lên đầu (createdAt: -1)
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng" });
    }
});

// 1. API TẠO ĐƠN HÀNG (Dùng khi khách nhấn "Thanh toán")
router.post('/create-order', async (req, res) => {
    // Nhận thêm paymentMethod từ Frontend
    const { userId, items, totalAmount, fullname, phone, address, paymentMethod } = req.body;
    const orderCode = `ORD${Date.now()}`;

    try {
        const newOrder = await Order.create({
            userId, fullname, phone, address, items, totalAmount, orderCode,
            paymentMethod // Lưu phương thức khách chọn
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