import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, List } from 'lucide-react';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', description: '' });

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
    const token = localStorage.getItem('token');

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categories`);
            const data = await res.json();
            setCategories(data);
        } catch (err) { console.log(err); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = isEditMode ? "PUT" : "POST";
        const url = isEditMode ? `${API_URL}/api/categories/${currentCategory._id}` : `${API_URL}/api/categories`;

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json", "token": `Bearer ${token}` },
                body: JSON.stringify(currentCategory)
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchCategories();
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa danh mục này sếp nhé? Lưu ý: Các sản phẩm thuộc danh mục này sẽ bị ảnh hưởng!")) {
            try {
                const res = await fetch(`${API_URL}/api/categories/${id}`, {
                    method: 'DELETE',
                    headers: { 'token': `Bearer ${token}` }
                });
                if (res.ok) fetchCategories();
            } catch (err) { console.log(err); }
        }
    };

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3 italic">
                    <List className="text-blue-500" /> Quản lý danh mục
                </h2>
                <button
                    onClick={() => { setIsEditMode(false); setCurrentCategory({ name: '', description: '' }); setIsModalOpen(true); }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 font-bold"
                >
                    <Plus size={20} /> Thêm danh mục mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div key={cat._id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-blue-200 transition-all group relative">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setIsEditMode(true); setCurrentCategory(cat); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-white rounded-xl shadow-sm"><Pencil size={16} /></button>
                                <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-500 hover:bg-white rounded-xl shadow-sm"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{cat.description || "Chưa có mô tả cho danh mục này."}</p>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        <h3 className="text-2xl font-black mb-8 text-gray-800">{isEditMode ? "Sửa danh mục 📝" : "Danh mục mới ✨"}</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Tên danh mục</label>
                                <input type="text" value={currentCategory.name} className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Mô tả</label>
                                <textarea className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 h-32" value={currentCategory.description} onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}></textarea>
                            </div>
                            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 mt-4">
                                {isEditMode ? "Cập nhật ngay" : "Tạo danh mục"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;