const jwt = require('jsonwebtoken');

// 1. Hàm kiểm tra xem người dùng đã đăng nhập chưa (Verify Token)
const verifyToken = (req, res, next) => {
    // Token thường được gửi trong Header với tên 'token' hoặc 'Authorization'
    const authHeader = req.headers.token || req.headers.authorization;

    if (authHeader) {
        // Nếu dùng định dạng "Bearer <chuỗi_token>"
        const token = authHeader.split(" ")[1];

        // "SECRET_KEY_CUA_TUI" phải khớp với mã bí mật lúc bạn tạo token ở file Login (Backend)
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json("Token không hợp lệ!");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: "Bạn chưa đăng nhập (Thiếu Token)!" });
    }
};

// 2. Hàm kiểm tra xem người dùng có phải là Admin không
const isAdmin = (req, res, next) => {
    // Chạy verifyToken trước để lấy thông tin req.user
    verifyToken(req, res, () => {
        if (req.user && req.user.isAdmin) {
            next(); // Đúng là Admin rồi, mời vào!
        } else {
            res.status(403).json({ message: "Truy cập bị từ chối! Bạn không có quyền Admin." });
        }
    });
};

module.exports = { verifyToken, isAdmin };