import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut, Layers } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* SIDEBAR */}
            <div className="w-64 bg-gray-900 text-white p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-10 italic text-blue-400">Admin Panel 🛠️</h2>

                <nav className="flex-1 space-y-4">
                    <Link to="/admin" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-xl transition-all">
                        <LayoutDashboard size={20} /> <span>Tổng quan</span>
                    </Link>
                    <Link to="/admin/orders" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-xl transition-all">
                        <ShoppingCart size={20} /> <span>Đơn hàng</span>
                    </Link>
                    <Link to="/admin/categories" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-xl transition-all">
                        <Layers size={20} /> <span>Danh mục</span>
                    </Link>
                    <Link to="/admin/products" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-xl transition-all">
                        <Package size={20} /> <span>Sản phẩm</span>
                    </Link>
                    <Link to="/admin/users" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-xl transition-all">
                        <Users size={20} /> <span>Khách hàng</span>
                    </Link>
                </nav>

                <button onClick={handleLogout} className="mt-auto flex items-center space-x-3 p-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-all">
                    <LogOut size={20} /> <span>Đăng xuất</span>
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 p-10">
                {/* Đây là nơi nội dung các trang con (Orders, Products...) sẽ hiện ra */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;