import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { ShoppingCart, User, Search, Menu, LogOut } from 'lucide-react'; // Thêm LogOut icon
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    // 1. Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // 2. Hàm Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert("Đã đăng xuất!");
        navigate('/login');
        window.location.reload(); // Reload để cập nhật giao diện ngay lập tức
    };

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo - Bọc trong Link để nhấn về Trang chủ */}
                    <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            MERN.Shop
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                placeholder="Tìm kiếm sản phẩm..."
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                        </div>
                    </div>

                    {/* Icons & Actions */}
                    <div className="flex items-center space-x-5">

                        {/* PHẦN ĐĂNG NHẬP / USER */}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                        {user?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <span className="hidden sm:block font-medium text-sm">Hi, {user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                                <User className="w-6 h-6" />
                                <span className="hidden sm:block text-sm font-medium">Đăng nhập</span>
                            </Link>
                        )}

                        {/* GIỎ HÀNG */}
                        <Link to="/cart" className="relative cursor-pointer hover:text-blue-600 transition-colors">
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Nút Menu cho điện thoại */}
                        <div className="md:hidden cursor-pointer">
                            <Menu className="w-6 h-6 text-gray-700" />
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;