import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await fetch("https://my-ecommerce-web-rlmf.onrender.com/api/products");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.log(err);
            }
        };
        getProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`https://my-ecommerce-web-rlmf.onrender.com/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { 'token': `Bearer ${token}` }
                });
                if (res.ok) {
                    setProducts(products.filter(p => p._id !== id));
                    alert("Đã xóa thành công!");
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm 🚗</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-blue-700 transition-all">
                    <Plus size={20} /> <span>Thêm xe mới</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">Hình ảnh</th>
                            <th className="px-6 py-4">Tên xe</th>
                            <th className="px-6 py-4">Giá thuê/ngày</th>
                            <th className="px-6 py-4">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 transition-all">
                                <td className="px-6 py-4">
                                    <img src={product.image} alt="" className="w-16 h-10 object-cover rounded-lg" />
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-700">{product.name}</td>
                                <td className="px-6 py-4 text-blue-600 font-bold">
                                    {product.price?.toLocaleString()}đ
                                </td>
                                <td className="px-6 py-4 flex space-x-3">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;