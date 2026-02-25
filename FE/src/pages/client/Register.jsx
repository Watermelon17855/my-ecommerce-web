import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { notify } from '../../utils/useNotify';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    // State đồng bộ với các trường input
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                notify.success("Tạo tài khoản thành công! 🎖️", "Mời bạn đăng nhập để bắt đầu mua sắm.");
                setTimeout(() => { navigate('/login'); }, 1500);
            } else {
                notify.error("Đăng ký thất bại", data.message || "Email này đã được sử dụng.");
            }
        } catch (err) {
            notify.error("Lỗi kết nối", "Hệ thống đang bảo trì, vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">

            {/* --- FORM CARD TRẮNG TINH --- */}
            <div className="w-full max-w-[450px] bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">

                {/* Header: Đơn giản, hiện đại */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-3 uppercase tracking-tighter italic">Đăng ký</h1>
                    <p className="text-gray-500 text-sm font-medium">Trở thành thành viên của MERN TECH</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Họ và Tên */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Họ và tên</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-all" size={20} />
                            <input
                                type="text"
                                placeholder="Nhập tên của bạn..."
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder:text-gray-300 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-all" size={20} />
                            <input
                                type="email"
                                placeholder="example@mern.tech"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder:text-gray-300 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Mật khẩu */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Mật khẩu</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-all" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Tối thiểu 6 ký tự..."
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-14 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder:text-gray-300 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Nút bấm Đăng ký */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-6 bg-gray-900 hover:bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-md hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        {loading ? "Đang xử lý..." : (
                            <>Tạo tài khoản ngay <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>

                {/* Footer: Điều hướng về Login */}
                <div className="mt-10 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Đã có tài khoản?
                    <Link to="/login" className="ml-2 text-blue-600 hover:underline transition-all">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;