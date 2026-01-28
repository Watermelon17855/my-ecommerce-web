const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { isAdmin } = require('../middleware/authMiddleware');

// 1. API lấy các thông số tổng quát cho Dashboard
// 1. API THỐNG KÊ TỔNG QUÁT
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const query = {
            $or: [
                // Dùng regex để khớp với bất kỳ chuỗi nào chứa "Tiền mặt", "cash" hoặc "cod"
                { paymentMethod: { $regex: /Tiền mặt|cash|cod/i } },
                { paymentMethod: { $regex: /transfer|chuyển khoản/i }, paymentStatus: "paid" }
            ]
        };

        const revenueData = await Order.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
        // Đếm tất cả đơn hàng hiện có để con số "Đơn hàng mới" hiện đúng
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ isAdmin: false });

        res.status(200).json({ totalRevenue, totalOrders, totalUsers });
    } catch (err) {
        res.status(500).json({ message: "Lỗi: " + err.message });
    }
});

// 2. API lấy dữ liệu biểu đồ doanh thu theo ngày

router.get('/revenue-chart', isAdmin, async (req, res) => {
    try {
        const { from, to } = req.query;
        // Ép giờ bắt đầu và kết thúc chuẩn múi giờ Việt Nam (+07:00)
        const startDate = new Date(`${from}T00:00:00+07:00`);
        const endDate = new Date(`${to}T23:59:59+07:00`);

        const revenueData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    $or: [
                        { paymentMethod: { $regex: /Tiền mặt|cash|cod/i } },
                        { paymentMethod: { $regex: /transfer|chuyển khoản/i }, paymentStatus: "paid" }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        // QUAN TRỌNG: Thêm timezone Asia/Ho_Chi_Minh để đơn rạng sáng 14/01 vào đúng ngày 14
                        date: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt",
                                timezone: "Asia/Ho_Chi_Minh"
                            }
                        },
                        method: "$paymentMethod"
                    },
                    total: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id.date": 1 } }
        ]);

        const formattedData = {};
        revenueData.forEach(item => {
            const date = item._id.date;
            // Chuẩn hóa tên phương thức: Chứa "Tiền mặt" hoặc "COD" thì tính là 'cash'
            const method = /Tiền mặt|cash|cod/i.test(item._id.method) ? 'cash' : 'transfer';

            if (!formattedData[date]) {
                formattedData[date] = { date, cash: 0, transfer: 0 };
            }

            // DÙNG += ĐỂ CỘNG DỒN (Không dùng = kẻo bị ghi đè mất tiền)
            formattedData[date][method] += item.total;
        });

        res.status(200).json(Object.values(formattedData));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. API lấy tất cả đơn hàng cho Admin
router.get('/all-orders', isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng" });
    }
});

// 4. API TẠO ĐƠN HÀNG
router.post('/create-order', async (req, res) => {
    const { userId, items, totalAmount, fullname, phone, address, paymentMethod } = req.body;
    const orderCode = `ORD${Date.now()}`;
    try {
        const newOrder = await Order.create({
            userId, fullname, phone, address, items, totalAmount, orderCode, paymentMethod
        });
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. WEBHOOK NHẬN DỮ LIỆU TỪ SEPAY
router.post('/sepay-webhook', async (req, res) => {
    const { content, transferAmount } = req.body;
    try {
        const orderCodeMatch = content.match(/ORD\d+/i);
        const orderCode = orderCodeMatch ? orderCodeMatch[0].toUpperCase() : null;

        if (orderCode) {
            const order = await Order.findOne({ orderCode });
            if (order && order.paymentStatus === 'pending' && transferAmount >= order.totalAmount) {
                order.paymentStatus = 'paid';
                await order.save();
                await Cart.deleteMany({ userId: order.userId });
                return res.status(200).json({ success: true });
            }
        }
        res.status(200).json({ message: "Chưa khớp đơn hàng hoặc điều kiện" });
    } catch (err) {
        res.status(500).send("Lỗi xử lý server");
    }
});

// 6. API KIỂM TRA TRẠNG THÁI ĐƠN HÀNG
router.get('/check-paymentStatus/:orderCode', async (req, res) => {
    try {
        const order = await Order.findOne({ orderCode: req.params.orderCode });
        res.json({ paymentStatus: order ? order.paymentStatus : 'not_found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;