import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Image as ImageIcon, X, PlusCircle, Link as LinkIcon } from 'lucide-react';
import { notify } from '../../utils/useNotify';

const AdminBrands = () => {
    const [brands, setBrands] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBrand, setNewBrand] = useState({ name: '', logo: '' }); // logo giờ là string (link)
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    const fetchBrands = async () => {
        try {
            const res = await fetch(`${API_URL}/api/brands`);
            const data = await res.json();
            setBrands(data);
        } catch (error) {
            console.error("Lỗi lấy nhãn hàng:", error);
        }
    };

    useEffect(() => { fetchBrands(); }, []);

    const handleAdd = async () => {
        if (!newBrand.name || !newBrand.logo) {
            return notify.error("Thiếu thông tin!", "Sếp vui lòng nhập tên và dán link logo nhé.");
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/brands`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBrand), // Gửi JSON thẳng tiến
            });

            if (res.ok) {
                notify.success("Thành công! 🏷️", "Đã thêm nhãn hàng mới.");
                setNewBrand({ name: '', logo: '' });
                setIsModalOpen(false);
                fetchBrands();
            }
        } catch (error) {
            notify.error("Lỗi rồi sếp ơi!", "Không thể thêm nhãn hàng.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa nhãn hàng này nhé sếp?")) {
            await fetch(`${API_URL}/api/brands/${id}`, { method: 'DELETE' });
            notify.success("Đã xóa!", "Nhãn hàng đã bay màu.");
            fetchBrands();
        }
    };

    return (
        <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm relative min-h-[500px]">

            {/* Header: Tiêu đề + Nút thêm mới */}
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-800 italic tracking-tighter flex items-center gap-3 uppercase">
                    <ImageIcon className="text-blue-600" /> Quản lý nhãn hàng
                </h2>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-100 active:scale-95 group"
                >
                    <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    THÊM MỚI
                </button>
            </div>

            {/* --- MODAL FORM: NHẬP LINK --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

                    <div className="relative w-full max-w-md bg-white border border-gray-100 p-10 rounded-[3rem] shadow-2xl animate-in zoom-in duration-300">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-300 hover:text-gray-900 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-xl font-black text-gray-900 mb-8 italic uppercase tracking-widest text-center">Tạo nhãn hàng</h3>

                        <div className="space-y-6">
                            {/* Tên nhãn hàng */}
                            <div className="space-y-2">
                                <label className="text-blue-600 text-[10px] font-black uppercase tracking-widest ml-2">Tên thương hiệu</label>
                                <input
                                    type="text"
                                    placeholder="VD: Apple, Samsung..."
                                    value={newBrand.name}
                                    onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 outline-none focus:bg-white focus:border-blue-600/20 transition-all"
                                />
                            </div>

                            {/* Dán Link Logo */}
                            <div className="space-y-2">
                                <label className="text-blue-600 text-[10px] font-black uppercase tracking-widest ml-2">Link Logo (URL)</label>
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            placeholder="Dán link ảnh tại đây..."
                                            value={newBrand.logo}
                                            onChange={(e) => setNewBrand({ ...newBrand, logo: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 outline-none focus:bg-white focus:border-blue-600/20 transition-all text-sm"
                                        />
                                        <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                    </div>

                                    {/* Preview tự động hiện khi dán link */}
                                    {newBrand.logo && (
                                        <div className="w-14 h-14 bg-gray-50 rounded-xl p-1.5 border border-blue-100 flex-shrink-0">
                                            <img
                                                src={newBrand.logo}
                                                className="w-full h-full object-contain"
                                                alt="Preview"
                                                onError={(e) => e.target.src = 'https://placehold.co/100x100?text=Error'} // Hiện ảnh lỗi nếu link dỏm
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleAdd}
                                disabled={loading}
                                className="w-full bg-gray-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-sm transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50 mt-4"
                            >
                                {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN THÊM"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- DANH SÁCH NHÃN HÀNG --- */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {brands.map(brand => (
                    <div key={brand._id} className="relative group bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center hover:bg-white hover:shadow-xl hover:border-blue-500/20 transition-all duration-500">
                        <div className="h-12 w-full flex items-center justify-center mb-3">
                            <img
                                // Hiển thị link trực tiếp từ DB
                                src={brand.logo}
                                alt={brand.name}
                                className="h-full object-contain group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{brand.name}</p>

                        <button
                            onClick={() => handleDelete(brand._id)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminBrands;