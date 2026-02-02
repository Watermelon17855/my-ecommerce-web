const sendOrderNotification = require('../utils/emailHelper');

exports.createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();

        // 🔥 GỬI MAIL THÔNG BÁO CHO ADMIN
        // Không dùng await ở đây để không bắt khách phải đợi mail gửi xong mới thấy thông báo thành công
        sendOrderNotification(savedOrder).catch(err => console.log("Lỗi gửi mail nè sếp:", err));;

        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};