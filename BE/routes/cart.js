const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// --- 1. LẤY GIỎ HÀNG ---
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('products.productId');
        if (!cart) return res.status(200).json({ products: [] });
        res.status(200).json(cart);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- 2. THÊM VÀO GIỎ ---
router.post('/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
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
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- 1. XÓA 1 SẢN PHẨM CỤ THỂ ---
router.delete('/remove/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        let cart = await Cart.findOne({ userId });
        if (cart) {
            // Lọc bỏ sản phẩm có ID này ra khỏi mảng products
            cart.products = cart.products.filter(p => p.productId.toString() !== productId);
            await cart.save();
            const updatedCart = await Cart.findOne({ userId }).populate('products.productId');
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- 2. CẬP NHẬT SỐ LƯỢNG (Tăng/Giảm) ---
router.put('/update-quantity', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Không thấy giỏ hàng" });

        const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.products[itemIndex].quantity = quantity; // Cập nhật số lượng mới gửi lên
            await cart.save();
            const updatedCart = await Cart.findOne({ userId }).populate('products.productId');
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ message: "Sản phẩm không có trong giỏ" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;