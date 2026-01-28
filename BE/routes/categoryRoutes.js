const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { isAdmin } = require('../middleware/authMiddleware');

// 1. Lấy tất cả (Ai cũng xem được)
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 2. Thêm danh mục (Chỉ Admin)
router.post('/', isAdmin, async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) { res.status(400).json({ message: "Lỗi: " + err.message }); }
});

// 3. Cập nhật danh mục (Chỉ Admin)
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// 4. Xóa danh mục (Chỉ Admin)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xóa danh mục" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;