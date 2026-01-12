const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
// Nhớ import thêm Product nếu bạn dùng populate (tùy phiên bản mongoose)
const Product = require('../models/Product');

// --- 1. LẤY GIỎ HÀNG VỀ (MỚI THÊM) ---
router.get('/:userId', async (req, res) => {
    try {
        // Tìm giỏ hàng của user và dùng populate để lấy chi tiết Tên, Ảnh, Giá từ bảng Product
        const cart = await Cart.findOne({ userId: req.params.userId })
            .populate('products.productId');

        if (!cart) {
            return res.status(200).json({ products: [] });
        }
        res.status(200).json(cart);
    } catch (err) {
        console.error("Lỗi lấy giỏ hàng:", err);
        res.status(500).json({ message: err.message });
    }
});

// --- 2. THÊM VÀO GIỎ HÀNG (GIỮ NGUYÊN CODE CỦA BẠN) ---
router.post('/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        if (!userId || !productId) {
            return res.status(400).json({ message: "Thiếu thông tin người dùng hoặc sản phẩm" });
        }

        let cart = await Cart.findOne({ userId });

        if (cart) {
            const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.products[itemIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
            await cart.save();
        } else {
            await Cart.create({ userId, products: [{ productId, quantity }] });
        }
        res.status(200).json({ message: "Thành công" });
    } catch (err) {
        console.error("Lỗi BE:", err);
        res.status(500).json({ message: err.message });
    }
});

// 1. Xóa toàn bộ một sản phẩm khỏi giỏ (Icon xọt rác)
router.delete('/clear/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // Xóa giỏ hàng dựa trên userId
        await Cart.deleteOne({ userId: userId });
        res.status(200).json({ message: "Đã dọn sạch giỏ hàng COD" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Giảm số lượng đi 1 (Dấu trừ)
router.post('/decrease', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

        const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (itemIndex > -1) {
            if (cart.products[itemIndex].quantity > 1) {
                cart.products[itemIndex].quantity -= 1; // Giảm 1
            } else {
                // Nếu bằng 1 thì không giảm nữa (đúng ý bạn muốn nút trừ chỉ hoạt động khi >= 2)
                return res.status(400).json({ message: "Số lượng tối thiểu là 1" });
            }
            await cart.save();
            // Lấy lại dữ liệu mới nhất kèm thông tin SP
            const updatedCart = await Cart.findOne({ userId }).populate('products.productId');
            return res.status(200).json(updatedCart);
        }
        res.status(404).json({ message: "Sản phẩm không có trong giỏ" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;