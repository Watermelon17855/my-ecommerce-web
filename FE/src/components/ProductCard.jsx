import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="group bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between h-full">
            <div>
                {/* 1. Phần khung ảnh giữ nguyên h-48 và overflow-hidden */}
                <Link to={`/product/${product._id}`}>
                    <div className="overflow-hidden rounded-xl mb-4 h-48 bg-gray-50 flex items-center justify-center">
                        <img
                            src={product.img}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                </Link>

                {/* 2. Đưa tên sản phẩm ra ngoài khung h-48 để không bị che */}
                <Link to={`/product/${product._id}`}>
                    <h3 className="font-bold text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2 min-h-[3rem]">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-blue-600 font-bold mt-2 text-lg">
                    {product.price?.toLocaleString()}đ
                </p>
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