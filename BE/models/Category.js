const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tên danh mục không được để trống"],
        unique: true, // Không cho phép trùng tên
        trim: true
    },
    description: {
        type: String,
        default: ""
    }
}, { timestamps: true }); // Tự động tạo createdAt và updatedAt

module.exports = mongoose.model('Category', categorySchema);