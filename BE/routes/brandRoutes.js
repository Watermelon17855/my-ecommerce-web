const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

// Lấy tất cả nhãn hàng (Cho trang Home)
router.get('/', async (req, res) => {
    const brands = await Brand.find();
    res.json(brands);
});

// Thêm nhãn hàng mới (Cho Admin)
router.post('/', async (req, res) => {
    const newBrand = new Brand(req.body);
    await newBrand.save();
    res.json(newBrand);
});

// Xóa nhãn hàng
router.delete('/:id', async (req, res) => {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa" });
});

module.exports = router;