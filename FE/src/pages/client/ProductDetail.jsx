import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/products/${id}`);
                if (!response.ok) throw new Error("Không tìm thấy sản phẩm");
                const data = await response.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi fetch chi tiết sản phẩm:", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Nếu đang tải, hiện thông báo thay vì để trắng trang
    if (loading) return <div className="text-center py-20 text-2xl">Đang kết nối server...</div>;

    // Nếu không tìm thấy sản phẩm
    if (!product) return <div className="text-center py-20 text-red-500">❌ Lỗi: Không thể lấy dữ liệu sản phẩm!</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row gap-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl p-4 flex items-center justify-center">
                    <img src={product.img} alt={product.name} className="max-h-[500px] object-contain" />
                </div>
                <div className="flex-1 space-y-6">
                    <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
                    <p className="text-3xl font-bold text-blue-600">{product.price?.toLocaleString()}đ</p>
                    <p className="text-gray-600 text-lg leading-relaxed border-t border-b py-6">{product.description}</p>
                    <button
                        onClick={() => addToCart(product)}
                        className="bg-gray-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95"
                    >
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;