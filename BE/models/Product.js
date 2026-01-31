const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    subImages: { type: [String], default: [] },
    description: { type: String },
    countInStock: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Phải khớp với tên model trong file Category.js
        required: [true, "Sản phẩm phải thuộc về một danh mục nào đó sếp ơi!"]
    }
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);