const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// API lấy tất cả sản phẩm từ Database
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({}); // Lấy hết sản phẩm trong bảng products
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server: " + err.message });
    }
});

// API lấy chi tiết 1 sản phẩm theo ID (dùng cho trang ProductDetail)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
    } catch (err) {
        res.status(500).json({ message: "ID không hợp lệ hoặc lỗi server" });
    }
});

module.exports = router; // CỰC KỲ QUAN TRỌNG: Phải có dòng này