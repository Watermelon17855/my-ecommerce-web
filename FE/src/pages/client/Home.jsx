import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // 1. Import để đọc URL
import ProductCard from "../../components/ProductCard";
import CategorySidebar from "../../components/CategorySidebar";
import { ChevronRight, Search, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // 2. Lấy từ khóa tìm kiếm từ URL (ví dụ: ?q=iphone)
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || "";

    // 3. FETCH DỮ LIỆU GỐC (Chỉ chạy 1 lần khi load trang)
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

    // 4. LOGIC LỌC KÉP: Tự động chạy khi Sản phẩm, Danh mục hoặc Từ khóa thay đổi
    useEffect(() => {
        let result = products;

        // BƯỚC A: Lọc theo danh mục
        if (activeCategory !== "all") {
            result = result.filter(p => {
                const prodCatId = p.category?._id || p.category;
                return prodCatId === activeCategory;
            });
        }

        // BƯỚC B: Lọc tiếp theo từ khóa tìm kiếm (Không phân biệt hoa thường)
        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(result);
    }, [products, activeCategory, searchQuery]);

    const handleCategoryClick = (id) => setActiveCategory(id);

    // 5. Hàm xóa nhanh tìm kiếm để quay về ban đầu
    const clearSearch = () => {
        setSearchParams({}); // Xóa sạch param ?q= trên URL
    };

    if (loading) return <div className="text-center py-20 font-bold animate-pulse text-2xl">Đang tải sản phẩm...</div>;

    return (
        <div className="py-10 px-4 md:px-10 bg-gray-50/30 min-h-screen relative">

            {/* NÚT MỞ SIDEBAR (Chỉ hiện khi Sidebar đang đóng) */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-blue-600 text-white p-2 rounded-r-2xl shadow-xl hover:pl-4 transition-all duration-300"
                >
                    <ChevronRight size={24} />
                </button>
            )}

            <div className="flex flex-col md:flex-row gap-8">

                {/* --- SIDEBAR CONTAINER --- */}
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-full md:w-64 opacity-100' : 'w-0 opacity-0 -ml-8'
                    }`}>
                    <CategorySidebar
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={handleCategoryClick}
                        onToggle={() => setIsSidebarOpen(false)}
                    />
                </div>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 transition-all duration-500">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-black text-gray-800 tracking-tight italic">
                                {searchQuery
                                    ? `Kết quả cho "${searchQuery}"`
                                    : (activeCategory === "all" ? "Tất cả sản phẩm" : categories.find(cat => cat._id === activeCategory)?.name)}
                            </h2>
                            <p className="text-gray-500 mt-1 font-medium">Tìm thấy {filteredProducts.length} sản phẩm.</p>
                        </div>

                        {/* HIỂN THỊ NÚT XÓA TÌM KIẾM NẾU ĐANG CÓ TỪ KHÓA */}
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
    );
};

export default Home;