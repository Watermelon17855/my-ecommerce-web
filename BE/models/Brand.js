const mongoose = require('mongoose');
const BrandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true } // Link ảnh logo
});
module.exports = mongoose.model('Brand', BrandSchema);