import { useState, useEffect } from 'react';
import ProductCard from "../../components/ProductCard";

const API_URL = "https://my-ecommerce-web-rlmf.onrender.com";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products`);
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi lấy sản phẩm:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="text-center py-20 font-bold text-2xl">Đang tải sản phẩm...</div>;
    return (
        <div className="py-10">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sản phẩm mới nhất</h2>
                    <p className="text-gray-500 mt-1">Cập nhật những thiết bị công nghệ hàng đầu.</p>
                </div>
                <button className="text-blue-600 font-semibold hover:underline">Xem tất cả</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Home;