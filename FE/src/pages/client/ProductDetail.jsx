import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { ChevronLeft, ChevronRight, ShoppingCart, Sparkles, Box, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

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
    }, [id, API_URL]);

    const gallery = product ? [product.img, ...(product.subImages || [])] : [];

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

    useEffect(() => {
        if (gallery.length <= 1) return;
        const timer = setInterval(() => { handleNext(); }, 5000);
        return () => clearInterval(timer);
    }, [activeImage, gallery]);

    const handleAddToCartAndGoToCart = () => {
        if (!product) return;
        addToCart(product);
        navigate('/cart');
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <div className="text-gray-900 font-black animate-pulse text-xs tracking-widest uppercase italic">Đang tải dữ liệu...</div>
        </div>
    );

    if (!product) return <div className="text-center py-20 text-red-500 font-bold">Máy này bị "bay màu" rồi sếp ơi!</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-10 relative z-10">

                <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Quay lại trang trước
                </button>

                {/* 🧊 KHỐI CHI TIẾT (White Minimal Card) */}
                <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12 mb-20 relative overflow-hidden">

                    {/* GALLERY - Khung ảnh nền xám nhạt */}
                    <div className="flex-1 space-y-6">
                        <div className="relative bg-gray-50 rounded-[2.5rem] p-8 flex justify-center items-center border border-gray-100 overflow-hidden h-[350px] md:h-[450px] group">
                            <img
                                key={activeImage}
                                src={activeImage}
                                alt={product.name}
                                className="w-full h-full object-contain animate-in fade-in zoom-in duration-500 drop-shadow-md"
                            />
                            <button onClick={handlePrev} className="absolute left-6 p-4 bg-white/80 backdrop-blur-md text-gray-800 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-gray-100">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={handleNext} className="absolute right-6 p-4 bg-white/80 backdrop-blur-md text-gray-800 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-gray-100">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-2 justify-center scrollbar-hide">
                            {gallery.map((url, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(url)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-2xl p-2 bg-white border-2 transition-all duration-300
                                        ${activeImage === url ? 'border-blue-600 scale-110 shadow-lg shadow-blue-100' : 'border-gray-100 opacity-50 hover:opacity-100'}`}
                                >
                                    <img src={url} alt="" className="w-full h-full object-contain rounded-lg" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* INFO - Font size tinh gọn, màu đen đậm */}
                    <div className="flex-1 flex flex-col justify-center space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                <Box size={14} /> {product.category?.name || "Premium Tech"}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 italic mt-6 tracking-tighter leading-[1.1]">
                                {product.name}
                            </h1>
                        </div>

                        <div className="flex items-baseline gap-4">
                            <p className="text-4xl font-black text-blue-600 tracking-tighter">
                                {product.price?.toLocaleString()}đ
                            </p>
                        </div>

                        <div className="h-px bg-gray-100 w-full" />

                        <div className="space-y-4">
                            <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                <Sparkles size={14} className="text-amber-400" /> Đặc điểm sản phẩm
                            </p>
                            <p className="text-gray-600 leading-relaxed text-base md:text-lg font-medium italic border-l-4 border-blue-600/20 pl-6 py-2">
                                {product.description || "Siêu phẩm cấu hình khủng dành cho sếp Vjp."}
                            </p>
                        </div>

                        {/* NÚT HÀNH ĐỘNG: Đen quyền lực, hover Xanh */}
                        <button
                            onClick={handleAddToCartAndGoToCart}
                            className="w-full py-5 bg-gray-900 hover:bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.1em] transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" />
                            THÊM VÀO GIỎ HÀNG
                        </button>
                    </div>
                </div>

                {/* --- GỢI Ý (Related Products) --- */}
                {relatedProducts.length > 0 && (
                    <div className="space-y-10">
                        <div className="flex justify-between items-end px-2">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-2 bg-gray-900 rounded-full shadow-sm" />
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 italic tracking-tighter uppercase">Sản phẩm tương tự</h2>
                            </div>
                            <button onClick={() => navigate(`/?cat=${product.category?._id || product.category}`)} className="text-blue-600 font-black hover:underline text-[11px] uppercase tracking-widest">
                                Xem tất cả →
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.slice(0, 4).map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;