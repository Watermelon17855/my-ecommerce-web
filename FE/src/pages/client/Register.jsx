import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "https://my-ecommerce-web-rlmf.onrender.com";

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Đăng ký thành công!");
                navigate('/login'); // Chuyển sang trang đăng nhập
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
                <h2 className="text-3xl font-bold mb-6 text-gray-800 italic">Tham gia với chúng tôi ✨</h2>
                <div className="space-y-4">
                    <input type="text" placeholder="Họ và tên" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    <input type="password" placeholder="Mật khẩu" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>
                <button type="submit" className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95">
                    Đăng ký ngay
                </button>
                <p className="mt-4 text-center text-gray-600">
                    Đã có tài khoản? <Link to="/login" className="text-blue-600 font-bold">Đăng nhập</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;