const User = require('../models/User'); // Đường dẫn tới file model bạn vừa gửi
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Kiểm tra email có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại!" });
        }

        // 2. Kiểm tra mật khẩu (So sánh mật khẩu nhập vào với mật khẩu đã hash trong DB)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không chính xác!" });
        }

        // 3. Tạo JWT Token
        // Ta đưa cả isAdmin vào payload của token để dễ kiểm tra sau này
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET, // Chuỗi bí mật bạn lưu ở file .env
            { expiresIn: '1d' }
        );

        // 4. Trả về thông tin cho Frontend
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin, // <-- Trả cái này về để FE làm giao diện
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

module.exports = { loginUser };