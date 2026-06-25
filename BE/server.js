require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173',           // Máy sếp đang code
        'https://my-ecommerce-web-psi.vercel.app', // Vercel
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.get('/test', (req, res) => {
    res.send("Server đang chạy bình thường!");
});

// Kết nối Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/ai', aiRoutes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Kết nối MongoDB thành công!"))
    .catch(err => console.log("❌ Lỗi kết nối:", err));

const PORT = process.env.PORT || 5001; // Đã đổi thành 5001
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại cổng ${PORT}`));