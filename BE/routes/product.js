const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isAdmin } = require('../middleware/authMiddleware');

// ==========================================
// 1. PUBLIC ROUTES (Ai cũng xem được)
// ==========================================


// API lấy tất cả sản phẩm từ Database
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ isAvailable: { $ne: false } }).populate('category', 'name');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/admin-all', isAdmin, async (req, res) => {
    try {
        const products = await Product.find({}).populate('category', 'name'); // Để trống {} là lấy sạch sành sanh
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API lấy chi tiết 1 sản phẩm theo ID (dùng cho trang ProductDetail)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
    } catch (err) {
        res.status(500).json({ message: "ID không hợp lệ hoặc lỗi server" });
    }
});

// ==========================================
// 2. ADMIN ROUTES (Chỉ Admin mới có quyền)
// ==========================================



// THÊM SẢN PHẨM MỚI
router.post('/', isAdmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body); // Lấy data từ form Admin gửi lên
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ message: "Không thể thêm sản phẩm: " + err.message });
    }
});

// CẬP NHẬT SẢN PHẨM (Sửa giá, sửa tên...)
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // Trả về dữ liệu mới sau khi sửa
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi cập nhật: " + err.message });
    }
});

// XÓA SẢN PHẨM
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Đã xóa sản phẩm thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi xóa: " + err.message });
    }
});

module.exports = router; 