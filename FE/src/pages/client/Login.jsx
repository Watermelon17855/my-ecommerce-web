import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from "../../context/CartContext";

const Login = () => {
    const { fetchCart } = useCart();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // Lưu vé thông hành
                localStorage.setItem('user', JSON.stringify(data.user)); // Lưu thông tin user
                alert("Chào mừng quay trở lại!");
                await fetchCart();
                window.location.href = "/";
                window.location.reload(); // Reload để Navbar cập nhật trạng thái
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Lỗi:", err);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 italic">Đăng nhập 🚀</h2>
                <div className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    <input type="password" placeholder="Mật khẩu" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>
                <button type="submit" className="w-full mt-8 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all active:scale-95">
                    Vào cửa hàng
                </button>
                <p className="mt-4 text-center text-gray-600">
                    Chưa có tài khoản? <Link to="/register" className="text-blue-600 font-bold">Đăng ký ngay</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;