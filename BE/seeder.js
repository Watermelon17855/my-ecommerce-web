const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Kết nối DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Đã kết nối để bơm dữ liệu..."))
    .catch(err => console.log(err));

const products = [
    {
        name: "iPhone 15 Pro Max",
        price: 28990000,
        img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_2.jpg",
        description: "Chip A17 Pro, khung viền Titan siêu nhẹ.",
        category: "Phone",
        countInStock: 10
    },
    {
        name: "Macbook Air M3 2024",
        price: 27490000,
        img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_2.jpg",
        description: "Siêu mỏng nhẹ, hiệu năng cực đỉnh với chip M3.",
        category: "Laptop",
        countInStock: 5
    },
    {
        name: "Apple Watch Ultra 2",
        price: 21990000,
        img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_2.jpg",
        description: "Đồng hồ thông minh bền bỉ nhất của Apple.",
        category: "Watch",
        countInStock: 7
    }
];

const importData = async () => {
    try {
        await Product.deleteMany(); // Xóa sạch bảng cũ để tránh trùng lặp
        await Product.insertMany(products); // Bơm đống sản phẩm ở trên vào
        console.log("🚀 Đã bơm dữ liệu sản phẩm thành công!");
        process.exit();
    } catch (error) {
        console.error("❌ Lỗi bơm dữ liệu:", error);
        process.exit(1);
    }
};

importData();