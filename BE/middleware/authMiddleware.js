const jwt = require('jsonwebtoken');

// 1. Kiểm tra xem có đăng nhập chưa
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        // Token thường gửi theo dạng "Bearer <chuỗi_token>"
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json("Token không hợp lệ!");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("Bạn chưa đăng nhập!");
    }
};

// 2. Kiểm tra có phải Admin không
const isAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Bạn không có quyền vào đây!");
        }
    });
};

module.exports = { verifyToken, isAdmin };