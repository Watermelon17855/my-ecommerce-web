import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    // 1. Tính toán % giảm giá (Chỉ tính nếu giá gốc lớn hơn giá hiện tại)
    const discount = (product.originalPrice && product.originalPrice > product.price)
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="group bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden">

            {/* 🔥 TAG GIẢM GIÁ (Hiện ở góc ảnh) */}
            {discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg z-10 shadow-md">
                    -{discount}%
                </div>
            )}

            <div>
                <Link to={`/product/${product._id}`}>
                    <div className="overflow-hidden rounded-xl mb-4 h-48 bg-gray-50 flex items-center justify-center">
                        <img
                            src={product.img}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                </Link>

                <Link to={`/product/${product._id}`}>
                    <h3 className="font-bold text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2 min-h-[3rem]">
                        {product.name}
                    </h3>
                </Link>

                {/* 💰 PHẦN GIÁ (Cập nhật giá gốc và giá giảm) */}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <p className="text-blue-600 font-black text-lg">
                        {product.price?.toLocaleString()}đ
                    </p>

                    {discount > 0 && (
                        <p className="text-gray-400 line-through text-xs italic">
                            {product.originalPrice?.toLocaleString()}đ
                        </p>
                    )}
                </div>
            </div>

            <button
                onClick={() => addToCart(product)}
                className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-blue-600 active:scale-95 transition-all shadow-lg shadow-gray-200"
            >
                Thêm vào giỏ
            </button>
        </div>
    );
};

export default ProductCard;