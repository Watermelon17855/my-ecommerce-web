import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from "../../components/ProductCard";
import CategorySidebar from "../../components/CategorySidebar";
import { ChevronRight, Search, X, Sparkles, Cpu, LayoutGrid } from 'lucide-react';
import BrandBar from "../../components/BrandBar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || "";
    const categoryFromUrl = searchParams.get('cat');

    useEffect(() => {
        if (categoryFromUrl) {
            setActiveCategory(categoryFromUrl);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [categoryFromUrl]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productRes = await fetch(`${API_URL}/api/products`);
                const productData = await productRes.json();
                const available = productData.filter(p => p.isAvailable !== false);
                setProducts(available);

                const categoryRes = await fetch(`${API_URL}/api/categories`);
                const categoryData = await categoryRes.json();
                setCategories(categoryData);

                setLoading(false);
            } catch (error) {
                console.error("Lỗi:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let result = products;
        if (activeCategory !== "all") {
            result = result.filter(p => {
                const prodCatId = p.category?._id || p.category;
                return prodCatId === activeCategory;
            });
        }
        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredProducts(result);
    }, [products, activeCategory, searchQuery]);

    const handleCategoryClick = (id) => {
        setActiveCategory(id);
        if (categoryFromUrl) setSearchParams({ q: searchQuery });
    };

    const clearSearch = () => setSearchParams({});

    // 🚀 LOADING STATE (Màu xanh trên nền trắng)
    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <Cpu size={60} className="text-blue-600 animate-spin mb-4" />
            <div className="text-gray-900 font-black animate-pulse text-2xl tracking-widest italic uppercase">
                Đang tải dữ liệu...
            </div>
        </div>
    );

    return (
        // 🔥 Nền xám nhạt giúp các Card sản phẩm trắng nổi bật lên
        <div className="bg-gray-50 min-h-screen">
            <BrandBar />

            <div className="py-10 px-4 md:px-10 min-h-screen relative">

                {/* NÚT MỞ SIDEBAR TRẮNG THANH LỊCH */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white text-blue-600 p-3 rounded-r-2xl shadow-xl border border-gray-100 hover:pl-6 transition-all duration-300 group"
                    >
                        <ChevronRight size={24} className="group-hover:scale-110 transition-transform" />
                    </button>
                )}

                <div className="flex flex-col md:flex-row gap-8">
                    {/* SIDEBAR CONTAINER */}
                    <div className={`transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-full md:w-72 opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
                        <CategorySidebar
                            categories={categories}
                            activeCategory={activeCategory}
                            onCategoryChange={handleCategoryClick}
                            onToggle={() => setIsSidebarOpen(false)}
                        />
                    </div>

                    <main className="flex-1 transition-all duration-500">
                        {/* HEADER TRANG CHỦ MÀU ĐẬM TRÊN NỀN TRẮNG */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                            <div className="relative">
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-blue-600 rounded-full shadow-sm"></div>
                                <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-3">
                                    <LayoutGrid className="text-blue-600" size={28} />
                                    {searchQuery
                                        ? `Kết quả: "${searchQuery}"`
                                        : (activeCategory === "all" ? "Tất cả sản phẩm" : categories.find(cat => cat._id === activeCategory)?.name)}
                                </h2>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2 ml-1 italic">Premium Technology Store</p>
                            </div>

                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="flex items-center gap-2 bg-red-50 text-red-500 px-6 py-3 rounded-2xl text-sm font-black hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
                                >
                                    <X size={18} /> XÓA TÌM KIẾM
                                </button>
                            )}
                        </div>

                        {/* GRID SẢN PHẨM */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            // 🔍 KHI KHÔNG TÌM THẤY HÀNG (Style Clean White)
                            <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                                    <Search size={40} className="text-gray-300" />
                                </div>
                                <p className="text-gray-900 font-black text-2xl italic tracking-tight mb-2 uppercase">Không tìm thấy máy sếp yêu cầu!</p>
                                <p className="text-gray-400 font-medium text-sm">Sếp thử kiểm tra lại từ khóa hoặc danh mục khác nhé.</p>
                                <button
                                    onClick={clearSearch}
                                    className="mt-8 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-100 uppercase text-xs tracking-widest"
                                >
                                    Xem tất cả sản phẩm
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Home;