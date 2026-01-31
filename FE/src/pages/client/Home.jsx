import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from "../../components/ProductCard";
import CategorySidebar from "../../components/CategorySidebar";
import { ChevronRight, Search, X } from 'lucide-react';
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

    // 🔥 DÒNG QUAN TRỌNG: Khai báo 2 biến này để máy hiểu sếp đang muốn gì
    const searchQuery = searchParams.get('q') || "";        // Lấy từ khóa ?q=...
    const categoryFromUrl = searchParams.get('cat');      // Lấy danh mục ?cat=...

    // 1. Logic bắt danh mục từ URL (Ví dụ: Nhấn "Xem tất cả" từ trang chi tiết)
    useEffect(() => {
        if (categoryFromUrl) {
            setActiveCategory(categoryFromUrl);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [categoryFromUrl]);

    // 2. FETCH DỮ LIỆU GỐC
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

    // 3. LOGIC LỌC KÉP: Theo danh mục VÀ Từ khóa
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
        // Khi nhấn tay chọn danh mục ở Sidebar, mình xóa cái ?cat trên URL cho sạch
        if (categoryFromUrl) setSearchParams({ q: searchQuery });
    };

    const clearSearch = () => setSearchParams({});

    if (loading) return <div className="text-center py-20 font-bold animate-pulse text-2xl">Đang tải sản phẩm...</div>;

    return (
        <div className="bg-gray-50/30 min-h-screen">
            <BrandBar />
            <div className="py-10 px-4 md:px-10 bg-gray-50/30 min-h-screen relative">

                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-blue-600 text-white p-2 rounded-r-2xl shadow-xl hover:pl-4 transition-all duration-300"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}

                <div className="flex flex-col md:flex-row gap-8">
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-full md:w-64 opacity-100' : 'w-0 opacity-0 -ml-8'}`}>
                        <CategorySidebar
                            categories={categories}
                            activeCategory={activeCategory}
                            onCategoryChange={handleCategoryClick}
                            onToggle={() => setIsSidebarOpen(false)}
                        />
                    </div>

                    <main className="flex-1 transition-all duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h2 className="text-3xl font-black text-gray-800 tracking-tight italic">
                                    {searchQuery
                                        ? `Kết quả cho "${searchQuery}"`
                                        : (activeCategory === "all" ? "Tất cả sản phẩm" : categories.find(cat => cat._id === activeCategory)?.name)}
                                </h2>
                            </div>

                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-all shadow-sm"
                                >
                                    <X size={16} /> Xóa tìm kiếm
                                </button>
                            )}
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-sm">
                                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={32} className="text-gray-300" />
                                </div>
                                <p className="text-gray-400 font-bold italic text-lg">Không tìm thấy máy sếp yêu cầu!</p>
                                <button onClick={clearSearch} className="mt-4 text-blue-600 font-bold hover:underline">Xem tất cả sản phẩm</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Home;