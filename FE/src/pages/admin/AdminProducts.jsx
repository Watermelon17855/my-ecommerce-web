import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ name: '', price: '', img: '', description: '' });

    const API_URL = "https://my-ecommerce-web-rlmf.onrender.com";
    const token = localStorage.getItem('token');

    // 1. Lấy danh sách sản phẩm
    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products`);
            const data = await res.json();
            setProducts(data);
        } catch (err) { console.log(err); }
    };

    useEffect(() => { fetchProducts(); }, []);

    // 2. Mở Modal để Thêm mới
    const openAddModal = () => {
        setIsEditMode(false);
        setCurrentProduct({ name: '', price: '', img: '', description: '' });
        setIsModalOpen(true);
    };

    // 3. Mở Modal để Sửa (Đổ dữ liệu cũ vào form)
    const openEditModal = (product) => {
        setIsEditMode(true);
        setCurrentProduct(product); // Lấy toàn bộ thông tin sản phẩm muốn sửa
        setIsModalOpen(true);
    };

    // 4. Xử lý Lưu (Cả Thêm mới và Cập nhật)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Quyết định URL và Phương thức (Nếu là Edit thì PUT, nếu là Thêm mới thì POST)
        const method = isEditMode ? "PUT" : "POST";
        const url = isEditMode
            ? `${API_URL}/api/products/${currentProduct._id}` // Link sửa
            : `${API_URL}/api/products`; // Link thêm mới

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    // GỬI TOKEN ĐỂ ADMIN MỚI LƯU ĐƯỢC
                    "token": `Bearer ${token}`
                },
                body: JSON.stringify(currentProduct) // Dữ liệu từ form
            });

            if (res.ok) {
                const data = await res.json();
                alert(isEditMode ? "Đã cập nhật!" : "Đã thêm vào Database thành công!");

                setIsModalOpen(false); // Đóng cửa sổ nhập
                fetchProducts(); // Gọi lại hàm lấy danh sách để thấy sản phẩm mới hiện ra
            } else {
                const errorData = await res.json();
                alert("Lỗi: " + errorData.message);
            }
        } catch (err) {
            console.error("Lỗi gửi dữ liệu:", err);
        }
    };

    // 5. Xử lý Xóa
    const handleDelete = async (id) => {
        if (window.confirm("Xóa sản phẩm này nhé?")) {
            try {
                const res = await fetch(`${API_URL}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { 'token': `Bearer ${token}` }
                });
                if (res.ok) fetchProducts();
            } catch (err) { console.log(err); }
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 italic">Quản lý sản phẩm </h2>
                <button onClick={openAddModal} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    <Plus size={20} /> <span className="font-bold text-sm">Thêm sản phẩm mới</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                        <tr>
                            <th className="px-6 py-4">Hình ảnh</th>
                            <th className="px-6 py-4">Tên sản phẩm</th>
                            <th className="px-6 py-4 text-center">Giá </th>
                            <th className="px-6 py-4 text-center">Mô tả</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 transition-all group">
                                <td className="px-6 py-4">
                                    <div className="w-20 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                        {/* KIỂM TRA TRƯỜNG product.img Ở ĐÂY */}
                                        <img src={product.img} alt="" className="w-full h-full object-cover" />
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-700">{product.name}</td>
                                <td className="px-6 py-4 text-center text-blue-600 font-bold">
                                    {product.price?.toLocaleString()}đ
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center space-x-2">
                                        <button onClick={() => openEditModal(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL (Dùng chung cho cả Thêm và Sửa) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>

                        <h3 className="text-2xl font-bold mb-8 text-gray-800">
                            {isEditMode ? "Cập nhật sản phẩm 📝" : "Thêm sản phẩm mới ✨"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text" placeholder="Tên sản phẩm" value={currentProduct.name}
                                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all"
                                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} required
                            />
                            <input
                                type="number" placeholder="Giá" value={currentProduct.price}
                                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all"
                                onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })} required
                            />
                            <input
                                type="text" placeholder="Link hình ảnh (URL)" value={currentProduct.img}
                                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all"
                                onChange={(e) => setCurrentProduct({ ...currentProduct, img: e.target.value })} required
                            />
                            <textarea
                                placeholder="Mô tả chi tiết" value={currentProduct.description}
                                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all h-28"
                                onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                            ></textarea>

                            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 mt-4">
                                {isEditMode ? "Lưu thay đổi" : "Tạo sản phẩm ngay"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;