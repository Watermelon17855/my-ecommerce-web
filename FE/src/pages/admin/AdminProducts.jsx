import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Package, Tag, Image as ImageIcon } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // 1. Quản lý link đang nhập dở
    const [currentSubLink, setCurrentSubLink] = useState("");

    // 2. Thêm trường subImages vào state mặc định
    const [currentProduct, setCurrentProduct] = useState({
        name: '', price: '', img: '', description: '', isAvailable: true, category: '', subImages: []
    });

    const [isAddingNewCat, setIsAddingNewCat] = useState(false);
    const [newCatName, setNewCatName] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
    const token = localStorage.getItem('token');

    // --- CÁC HÀM FETCH GIỮ NGUYÊN ---
    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products/admin-all`, {
                headers: { 'token': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setProducts(data);
        } catch (err) { console.log("Lỗi lấy hàng:", err); }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categories`);
            const data = await res.json();
            if (res.ok) setCategories(data);
        } catch (err) { console.log("Lỗi lấy danh mục:", err); }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // --- LOGIC QUẢN LÝ ẢNH PHỤ ---
    const addSubImage = () => {
        if (!currentSubLink.trim()) return;
        setCurrentProduct({
            ...currentProduct,
            subImages: [...(currentProduct.subImages || []), currentSubLink]
        });
        setCurrentSubLink("");
    };

    const removeSubImage = (index) => {
        const filtered = currentProduct.subImages.filter((_, i) => i !== index);
        setCurrentProduct({ ...currentProduct, subImages: filtered });
    };

    // --- CÁC HÀM MODAL ---
    const openAddModal = () => {
        setIsEditMode(false);
        setCurrentProduct({ name: '', price: '', img: '', description: '', isAvailable: true, category: '', subImages: [] });
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setIsEditMode(true);
        setCurrentProduct({
            ...product,
            category: product.category?._id || product.category || '',
            subImages: product.subImages || [] // Đảm bảo luôn có mảng để map
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = isEditMode ? "PUT" : "POST";
        const url = isEditMode ? `${API_URL}/api/products/${currentProduct._id}` : `${API_URL}/api/products`;

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json", "token": `Bearer ${token}` },
                body: JSON.stringify(currentProduct)
            });
            if (res.ok) { setIsModalOpen(false); fetchProducts(); }
        } catch (err) { console.error("Lỗi lưu:", err); }
    };

    // ... handleDelete và handleToggleStatus giữ nguyên như cũ của sếp ...
    const handleDelete = async (id) => {
        if (window.confirm("Xóa sản phẩm này nhé sếp?")) {
            try {
                const res = await fetch(`${API_URL}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { 'token': `Bearer ${token}` }
                });
                if (res.ok) fetchProducts();
            } catch (err) { console.log(err); }
        }
    };

    const handleToggleStatus = async (product) => {
        const updatedProduct = { ...product, isAvailable: !product.isAvailable };
        try {
            const res = await fetch(`${API_URL}/api/products/${product._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "token": `Bearer ${token}` },
                body: JSON.stringify(updatedProduct)
            });
            if (res.ok) fetchProducts();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-screen">
            {/* TIÊU ĐỀ VÀ BẢNG (Giữ nguyên giao diện đẹp của sếp) */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 italic flex items-center gap-2">
                    <Package className="text-blue-500" /> Quản lý sản phẩm
                </h2>
                <button onClick={openAddModal} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 font-bold">
                    <Plus size={20} /> <span>Thêm sản phẩm</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                        <tr>
                            <th className="px-6 py-4">Sản phẩm</th>
                            <th className="px-6 py-4">Danh mục</th>
                            <th className="px-6 py-4">Giá</th>
                            <th className="px-6 py-4 text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map((product) => (
                            <tr key={product._id} className={`hover:bg-gray-50 transition-all ${!product.isAvailable ? 'opacity-50' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-4">
                                        <img src={product.img} alt="" className="w-12 h-10 object-cover rounded-lg bg-gray-100" />
                                        <div className="font-bold text-gray-700">{product.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                                        {product.category?.name || "Chưa phân loại"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-blue-600 font-bold">{product.price?.toLocaleString()}đ</td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleToggleStatus(product)} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${product.isAvailable ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                        {product.isAvailable ? "Đang bán" : "Đã ẩn"}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center space-x-2">
                                        <button onClick={() => handleToggleStatus(product)} className="p-2 text-gray-400 hover:text-blue-500 rounded-lg">
                                            {product.isAvailable ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                        <button onClick={() => openEditModal(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL (Đã thêm phần ảnh phụ) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-xl shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">{isEditMode ? "Sửa sản phẩm 📝" : "Thêm sản phẩm ✨"}</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Tên sản phẩm" value={currentProduct.name} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} required />
                                <input type="number" placeholder="Giá" value={currentProduct.price} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })} required />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Danh mục sản phẩm</label>
                                {!isAddingNewCat ? (
                                    <div className="flex gap-2">
                                        <select
                                            value={currentProduct.category}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="">-- Chọn danh mục --</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <button type="button" onClick={() => setIsAddingNewCat(true)} className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"><Plus size={20} /></button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Tên danh mục mới..." value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="flex-1 p-3 border-2 border-blue-300 rounded-xl outline-none focus:border-blue-500" autoFocus />
                                        <button type="button" onClick={() => {/* Hàm thêm nhanh sếp viết rồi */ }} className="px-4 bg-green-600 text-white rounded-xl font-bold">Lưu</button>
                                        <button type="button" onClick={() => setIsAddingNewCat(false)} className="px-4 bg-gray-200 text-gray-600 rounded-xl font-bold">Hủy</button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Ảnh đại diện (Chính)</label>
                                <input type="text" placeholder="Link hình ảnh chính" value={currentProduct.img} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setCurrentProduct({ ...currentProduct, img: e.target.value })} required />
                            </div>

                            {/* --- PHẦN QUẢN LÝ ẢNH PHỤ --- */}
                            <div className="space-y-4 p-5 bg-blue-50/50 rounded-3xl border border-blue-100">
                                <label className="block text-sm font-black text-blue-800 uppercase tracking-wider flex items-center gap-2">
                                    <ImageIcon size={16} /> Ảnh phụ chi tiết ({currentProduct.subImages?.length || 0})
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Dán link ảnh chi tiết vào đây..."
                                        value={currentSubLink}
                                        onChange={(e) => setCurrentSubLink(e.target.value)}
                                        className="flex-1 p-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSubImage}
                                        className="bg-blue-600 text-white px-4 rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-100"
                                    >
                                        Thêm
                                    </button>
                                </div>

                                {/* Preview các ảnh phụ đã thêm */}
                                <div className="flex flex-wrap gap-3">
                                    {currentProduct.subImages?.map((url, index) => (
                                        <div key={index} className="relative group w-16 h-16">
                                            <img src={url} alt="" className="w-full h-full object-cover rounded-xl border-2 border-white shadow-sm" />
                                            <button
                                                type="button"
                                                onClick={() => removeSubImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all shadow-md"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <textarea placeholder="Mô tả sản phẩm" value={currentProduct.description} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 h-24 outline-none" onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}></textarea>

                            <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg mt-4">
                                {isEditMode ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;