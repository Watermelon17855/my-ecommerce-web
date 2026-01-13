const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAdmin } = require('../middleware/authMiddleware');

// --- ĐOẠN DÀNH CHO ADMIN ---//

// 1. Lấy tất cả người dùng (Chỉ Admin mới thấy)
router.get('/all-users', isAdmin, async (req, res) => {
    try {
        // Lấy hết user nhưng không lấy mật khẩu (-password)
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Lỗi: " + err.message });
    }
});

// 2. Xóa một người dùng
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Đã xóa người dùng thành công!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Cập nhật quyền Admin (Biến User thường thành Admin hoặc ngược lại)
router.put('/toggle-admin/:id', isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json("Không tìm thấy người dùng");

        user.isAdmin = !user.isAdmin; // Đảo ngược trạng thái
        await user.save();
        res.status(200).json({ message: "Đã cập nhật quyền thành công", user });
    } catch (err) {
        res.status(500).json(err);
    }
});


// --- ĐOẠN DÀNH CHO TẤT CẢ NGƯỜI DÙNG ---//

// ĐĂNG KÝ
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra xem user đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email đã tồn tại!" });

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Lưu user mới
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ĐĂNG NHẬP
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Sai email hoặc mật khẩu!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Sai email hoặc mật khẩu!" });

        // Tạo mã Token JWT
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;