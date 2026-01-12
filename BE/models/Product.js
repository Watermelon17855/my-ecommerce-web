const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    description: { type: String },
    countInStock: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);