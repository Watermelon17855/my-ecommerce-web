import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Heart } from "lucide-react";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    // 1. Tính toán % giảm giá
    const discount = (product.originalPrice && product.originalPrice > product.price)
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="group bg-white p-5 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden">

            {/* 🔥 TAG GIẢM GIÁ (Gradient nhẹ nhàng hơn) */}
            {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full z-10 shadow-md">
                    -{discount}%
                </div>
            )}



            <div>
                {/* KHUNG ẢNH TRÊN NỀN XÁM NHẠT */}
                <Link to={`/product/${product._id}`}>
                    <div className="overflow-hidden rounded-2xl mb-5 h-52 bg-gray-50 flex items-center justify-center border border-gray-50 relative group-hover:bg-white transition-colors duration-500">
                        <img
                            src={product.img}
                            alt={product.name}
                            className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                    </div>
                </Link>

                {/* TÊN SẢN PHẨM (Màu đen đậm) */}
                <Link to={`/product/${product._id}`}>
                    <h3 className="font-bold text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2 min-h-[3rem] text-base md:text-lg transition-colors duration-300 px-1 leading-tight">
                        {product.name}
                    </h3>
                </Link>

                {/* GIÁ CẢ & SALE (Màu sắc rõ ràng) */}
                <div className="mt-4 px-1 flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <p className="text-blue-600 font-black text-2xl tracking-tighter">
                            {product.price?.toLocaleString()}đ
                        </p>
                        {discount > 0 && (
                            <p className="text-gray-400 line-through text-xs font-medium">
                                {product.originalPrice?.toLocaleString()}đ
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* NÚT THÊM VÀO GIỎ (Vẫn giữ màu xanh làm điểm nhấn) */}
            <button
                onClick={() => addToCart(product)}
                className="w-full mt-6 bg-gray-900 hover:bg-blue-600 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-lg shadow-gray-200 active:scale-95 flex items-center justify-center gap-3 group/btn"
            >
                <ShoppingCart size={16} className="group-hover/btn:rotate-12 transition-transform" />
                THÊM VÀO GIỎ
            </button>
        </div>
    );
};

export default ProductCard;