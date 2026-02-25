import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';
import { notify } from '../../utils/useNotify';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (data.user.isAdmin === true) {
                    notify.success("Xin chào Admin! 🎖️", "Đang chuyển hướng tới trang quản trị...");
                    setTimeout(() => { navigate('/admin'); }, 1500);
                } else {
                    notify.success("Đăng nhập thành công!", "Chào mừng bạn quay trở lại.");
                    setTimeout(() => { navigate('/'); }, 1500);
                }
            } else {
                notify.error("Đăng nhập thất bại", data.message || "Email hoặc mật khẩu không đúng.");
            }
        } catch (err) {
            notify.error("Lỗi kết nối", "Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            {/* --- FORM CARD TRẮNG TINH --- */}
            <div className="w-full max-w-[450px] bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">

                {/* Header: Đơn giản, thân thiện */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-3">Đăng nhập</h1>
                    <p className="text-gray-500 text-sm font-medium">Chào mừng bạn quay trở lại!</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-4">Email</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-all" size={20} />
                            <input
                                type="email"
                                placeholder="Nhập email của bạn..."
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-4">Mật khẩu</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-all" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu..."
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-14 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Button: Đơn giản hóa text */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 bg-gray-900 hover:bg-blue-600 text-white rounded-2xl font-bold text-base transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        {loading ? "Đang xử lý..." : (
                            <>Đăng nhập <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>

                {/* Footer: Link Đăng ký */}
                <div className="mt-8 text-center text-sm font-medium text-gray-500">
                    Chưa có tài khoản?
                    <Link to="/register" className="ml-2 text-blue-600 font-bold hover:underline transition-all">
                        Đăng ký ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;