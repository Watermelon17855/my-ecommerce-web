import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, LogOut, X } from 'lucide-react';
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    const [searchTerm, setSearchTerm] = useState("");
    const [allProducts, setAllProducts] = useState([]); // Chứa tất cả để lọc gợi ý
    const [suggestions, setSuggestions] = useState([]); // Kết quả gợi ý hiện ra
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null); // Để xử lý khi bấm ra ngoài thì ẩn bảng

    const user = JSON.parse(localStorage.getItem('user'));

    // 1. Lấy tất cả sản phẩm về để làm dữ liệu gợi ý
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                const data = await res.json();
                setAllProducts(data.filter(p => p.isAvailable !== false));
            } catch (err) { console.error(err); }
        };
        fetchAll();

        // Xử lý khi click ra ngoài thanh tìm kiếm thì đóng bảng gợi ý
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    // 2. Logic Lọc Gợi Ý
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim().length > 0) {
            const matches = allProducts.filter(p =>
                p.name.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 5); // Chỉ lấy 5 kết quả đầu cho gọn
            setSuggestions(matches);
            setShowSuggestions(true);
            navigate(`/?q=${value}`); // Vẫn cập nhật kết quả dưới trang Home
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            navigate('/');
        }
    };

    // 3. Khi nhấn vào 1 sản phẩm gợi ý
    const handleSelectSuggestion = (productId) => {
        setSearchTerm("");
        setShowSuggestions(false);
        navigate(`/product/${productId}`); // Bay thẳng tới trang chi tiết
    };

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            MERN.Shop
                        </span>
                    </Link>

                    {/* Search Bar với Gợi ý */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={() => searchTerm && setShowSuggestions(true)}
                                className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-10 pr-10 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                                placeholder="Tìm kiếm sản phẩm..."
                            />
                            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                            {searchTerm && (
                                <button onClick={() => { setSearchTerm(""); setShowSuggestions(false); navigate('/') }} className="absolute right-3 top-3 text-gray-400 hover:text-red-500">
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* --- BẢNG GỢI Ý (SUGGESTIONS) --- */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-2">
                                    {suggestions.map((p) => (
                                        <div
                                            key={p._id}
                                            onClick={() => handleSelectSuggestion(p._id)}
                                            className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer rounded-xl transition-colors group"
                                        >
                                            <img src={p.img} alt="" className="w-10 h-10 object-cover rounded-lg bg-gray-50" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-700 truncate group-hover:text-blue-600">{p.name}</p>
                                                <p className="text-xs text-blue-500 font-bold">{p.price?.toLocaleString()}đ</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Icons & Actions */}
                    <div className="flex items-center space-x-5">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="hidden sm:flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">Hi, {user.name}</span>
                                </div>
                                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"><User size={22} /><span className="hidden sm:block text-sm font-bold">Đăng nhập</span></Link>
                        )}

                        <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                            <ShoppingCart size={22} />
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;