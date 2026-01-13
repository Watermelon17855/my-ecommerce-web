require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.get('/test', (req, res) => {
    res.send("Server đang chạy bình thường!");
});

// Kết nối Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Kết nối MongoDB thành công!"))
    .catch(err => console.log("❌ Lỗi kết nối:", err));

const PORT = process.env.PORT || 5001; // Đã đổi thành 5001
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại cổng ${PORT}`));