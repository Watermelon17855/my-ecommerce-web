const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: Array,
    totalAmount: Number,
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderCode: { type: String, unique: true }, // Mã đơn hàng để khách ghi vào nội dung chuyển khoản
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);