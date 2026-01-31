import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/products/${id}`);
                const data = await res.json();
                setProduct(data);
                setActiveImage(data.img);

                const allRes = await fetch(`${API_URL}/api/products`);
                const allData = await allRes.json();
                const currentCatId = data.category?._id || data.category;

                const related = allData.filter(p =>
                    (p.category?._id || p.category) === currentCatId &&
                    p._id !== id &&
                    p.isAvailable !== false
                );
                setRelatedProducts(related);
            } catch (err) {
                console.error("Lỗi fetch:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    const gallery = product ? [product.img, ...(product.subImages || [])] : [];

    // --- LOGIC ĐIỀU HƯỚNG MŨI TÊN ---
    const handleNext = () => {
        if (gallery.length <= 1) return;
        setActiveImage((prev) => {
            const currentIndex = gallery.indexOf(prev);
            const nextIndex = (currentIndex + 1) % gallery.length;
            return gallery[nextIndex];
        });
    };

    const handlePrev = () => {
        if (gallery.length <= 1) return;
        setActiveImage((prev) => {
            const currentIndex = gallery.indexOf(prev);
            const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
            return gallery[prevIndex];
        });
    };

    // 🔥 LOGIC TỰ ĐỘNG CHUYỂN ẢNH SAU 3 GIÂY
    useEffect(() => {
        if (gallery.length <= 1) return; // Chỉ chạy khi có từ 2 ảnh trở lên

        const timer = setInterval(() => {
            handleNext();
        }, 3000); // 3000ms = 3s

        // Dọn dẹp timer khi component unmount hoặc khi activeImage thay đổi
        return () => clearInterval(timer);
    }, [activeImage, gallery]);

    const handleSeeAll = () => {
        if (!product) return;
        const catId = product.category?._id || product.category;
        navigate(`/?cat=${catId}`);
    };

    if (loading) return <div className="text-center py-20 font-bold text-xl animate-pulse text-blue-600">Đang tìm máy cho sếp... 🔎</div>;
    if (!product) return <div className="text-center py-20 text-red-500 font-bold">Không tìm thấy sản phẩm!</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12 mb-20">

                {/* KHU VỰC GALLERY 📸 */}
                <div className="flex-1 space-y-6">
                    <div className="relative bg-gray-50 rounded-[2.5rem] p-8 flex justify-center items-center border border-gray-50 overflow-hidden h-[400px] md:h-[500px]">
                        {/* Ảnh chính với hiệu ứng mượt hơn khi chuyển */}
                        <img
                            key={activeImage} // Thêm key để React biết ảnh đổi và chạy animation
                            src={activeImage}
                            alt={product.name}
                            className="w-full h-full object-contain animate-in fade-in duration-700"
                        />

                        {/* Mũi tên trái */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 p-3 bg-white text-gray-800 rounded-full shadow-xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 z-10"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        {/* Mũi tên phải */}
                        <button
                            onClick={handleNext}
                            className="absolute right-4 p-3 bg-white text-gray-800 rounded-full shadow-xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 z-10"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* DÀN ẢNH NHỎ */}
                    <div className="flex gap-4 overflow-x-auto pb-2 px-2 scrollbar-hide">
                        {gallery.map((url, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImage(url)}
                                className={`flex-shrink-0 w-20 h-20 rounded-2xl p-1 bg-white border transition-all duration-300
                                    ${activeImage === url
                                        ? 'border-gray-400 opacity-100 scale-105 shadow-sm'
                                        : 'border-transparent opacity-40 hover:opacity-80'
                                    }`}
                            >
                                <img src={url} alt="" className="w-full h-full object-contain rounded-xl" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* THÔNG TIN SẢN PHẨM */}
                <div className="flex-1 flex flex-col justify-center space-y-8">
                    <div>
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">
                            {product.category?.name || "Điện thoại"}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-800 italic mt-4 tracking-tighter">
                            {product.name}
                        </h1>
                    </div>
                    <p className="text-4xl font-black text-blue-600">{product.price?.toLocaleString()}đ</p>
                    <div className="h-px bg-gray-100 w-full" />
                    <p className="text-gray-600 leading-relaxed text-lg italic">{product.description || "Máy cực đẹp sếp ơi!"}</p>
                    <button className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl">
                        Thêm vào giỏ hàng ngay 🛒
                    </button>
                </div>
            </div>

            {/* --- PHẦN SẢN PHẨM TƯƠNG TỰ (Giữ nguyên) --- */}
            {relatedProducts.length > 0 && (
                <div className="space-y-10">
                    <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-2.5 bg-blue-600 rounded-full" />
                            <h2 className="text-2xl md:text-3xl font-black text-gray-800 italic">Sản phẩm tương tự</h2>
                        </div>
                        {relatedProducts.length > 4 && (
                            <button onClick={handleSeeAll} className="px-6 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all text-sm">
                                Xem tất cả →
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {relatedProducts.slice(0, 4).map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;