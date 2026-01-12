const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: Array,
    totalAmount: Number,
    // paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['cash', 'transfer'], required: true },
    paymentStatus: { type: String, default: 'pending' },
    orderCode: { type: String, unique: true }, // Mã đơn hàng để khách ghi vào nội dung chuyển khoản
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);