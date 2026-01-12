const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/sepay-webhook', async (req, res) => {
    const data = req.body;
    // data.content là nội dung chuyển khoản khách ghi
    // data.transferAmount là số tiền khách chuyển

    try {
        // 1. Tìm mã đơn hàng trong nội dung chuyển khoản (Ví dụ: khách ghi "DH12345")
        const orderCode = data.content.match(/DH\d+/)?.[0];

        if (orderCode) {
            const order = await Order.findOne({ orderCode: orderCode });

            if (order && data.transferAmount >= order.totalAmount) {
                // 2. Cập nhật trạng thái đơn hàng thành Đã thanh toán
                order.paymentStatus = 'paid';
                await order.save();

                // 3. (Optional) Xóa giỏ hàng của user sau khi thanh toán xong
                // await Cart.findOneAndDelete({ userId: order.userId });

                return res.status(200).json({ success: true });
            }
        }
        res.status(200).json({ success: false, message: "Order not found or insufficient amount" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;