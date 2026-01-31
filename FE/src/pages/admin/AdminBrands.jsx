import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

const AdminBrands = () => {
    const [brands, setBrands] = useState([]);
    const [newBrand, setNewBrand] = useState({ name: '', logo: '' });
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    const fetchBrands = async () => {
        const res = await fetch(`${API_URL}/api/brands`);
        const data = await res.json();
        setBrands(data);
    };

    useEffect(() => { fetchBrands(); }, []);

    const handleAdd = async () => {
        await fetch(`${API_URL}/api/brands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBrand)
        });
        setNewBrand({ name: '', logo: '' });
        fetchBrands();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa nhãn hàng này nhé sếp?")) {
            await fetch(`${API_URL}/api/brands/${id}`, { method: 'DELETE' });
            fetchBrands();
        }
    };

    return (
        <div className="p-8 bg-white rounded-3xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 italic">Quản lý nhãn hàng 🏷️</h2>

            <div className="flex gap-4 mb-8 bg-gray-50 p-6 rounded-2xl">
                <input type="text" placeholder="Tên nhãn hàng" value={newBrand.name} onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })} className="flex-1 p-3 rounded-xl border-none outline-none" />
                <input type="text" placeholder="Link Logo" value={newBrand.logo} onChange={(e) => setNewBrand({ ...newBrand, logo: e.target.value })} className="flex-1 p-3 rounded-xl border-none outline-none" />
                <button onClick={handleAdd} className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 transition-all"><Plus /></button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {brands.map(brand => (
                    <div key={brand._id} className="relative group p-4 border rounded-2xl flex flex-col items-center">
                        <img src={brand.logo} alt={brand.name} className="h-12 object-contain mb-2" />
                        <p className="text-sm font-bold text-gray-600">{brand.name}</p>
                        <button onClick={() => handleDelete(brand._id)} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"><Trash2 size={14} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminBrands;