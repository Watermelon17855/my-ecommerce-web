import React, { useState, useEffect, useRef } from 'react';
// 🔥 Đã thêm useLocation vào import
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut, X, Sparkles } from 'lucide-react';
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation(); // 🔥 Khởi tạo location để kiểm tra đường dẫn
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    const [searchTerm, setSearchTerm] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user'));

    // Kiểm tra xem có đang ở trang quản trị không
    const isAdminPage = location.pathname.startsWith('/admin');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                const data = await res.json();
                setAllProducts(data.filter(p => p.isAvailable !== false));
            } catch (err) { console.error(err); }
        };
        fetchAll();

        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [API_URL]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim().length > 0) {
            const matches = allProducts.filter(p =>
                p.name.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 5);
            setSuggestions(matches);
            setShowSuggestions(true);
            navigate(`/?q=${value}`);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            navigate('/');
        }
    };

    const handleSelectSuggestion = (productId) => {
        setSearchTerm("");
        setShowSuggestions(false);
        navigate(`/product/${productId}`);
    };

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo: Thông minh - Admin về Dashboard, Khách về Home */}
                    <Link
                        to={isAdminPage ? "/admin" : "/home"}
                        className="flex-shrink-0 flex items-center group"
                    >
                        <div className="p-2 bg-blue-600 rounded-xl mr-2 shadow-lg shadow-blue-200 group-hover:bg-blue-700 transition-all">
                            <Sparkles className="text-white w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">
                            MERN<span className="text-blue-600">.TECH</span>
                        </span>
                        {isAdminPage && (
                            <span className="ml-2 bg-gray-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                Admin
                            </span>
                        )}
                    </Link>

                    {/* 🔥 CHỈ HIỆN THANH TÌM KIẾM NẾU KHÔNG PHẢI TRANG ADMIN */}
                    {!isAdminPage && (
                        <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onFocus={() => searchTerm && setShowSuggestions(true)}
                                    className="w-full bg-gray-100 border border-transparent rounded-2xl py-3 pl-12 pr-10 focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/30 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400"
                                    placeholder="Tìm kiếm sản phẩm..."
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                {searchTerm && (
                                    <button onClick={() => { setSearchTerm(""); setShowSuggestions(false); navigate('/') }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors">
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Bảng gợi ý */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-2">
                                        {suggestions.map((p) => (
                                            <div
                                                key={p._id}
                                                onClick={() => handleSelectSuggestion(p._id)}
                                                className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer rounded-2xl transition-all group"
                                            >
                                                <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-1">
                                                    <img src={p.img} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 truncate transition-colors">{p.name}</p>
                                                    <p className="text-xs text-blue-600 font-black">{p.price?.toLocaleString()}đ</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Icons & Actions */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md shadow-blue-200">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">{user.name}</span>
                                </div>
                                <button onClick={handleLogout} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><LogOut size={20} /></button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all font-bold text-sm bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100">
                                <User size={18} />
                                <span className="hidden sm:block uppercase tracking-widest text-[11px]">Đăng nhập</span>
                            </Link>
                        )}

                        {/* 🔥 CHỈ HIỆN GIỎ HÀNG NẾU KHÔNG PHẢI TRANG ADMIN */}
                        {!isAdminPage && (
                            <Link to="/cart" className="relative p-2.5 text-gray-600 hover:text-blue-600 transition-all bg-gray-50 rounded-xl border border-gray-100 group">
                                <ShoppingCart size={22} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full border-2 border-white shadow-lg shadow-blue-200">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;