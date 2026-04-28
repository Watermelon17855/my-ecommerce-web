import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';

const CompareModal = ({ firstProduct, onClose, onStartCompare }) => {
    const [listSameCategory, setListSameCategory] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                // Gọi API lấy SP cùng Category (Sếp nhớ check lại route này ở Backend nhé)
                const res = await axios.get(`http://localhost:5001/api/products?category=${firstProduct.category._id || firstProduct.category}`);
                // Loại bỏ máy đầu tiên đã chọn ra khỏi danh sách gợi ý
                const filtered = res.data.filter(p => p._id !== firstProduct._id);
                setListSameCategory(filtered);
            } catch (err) {
                console.error("Lỗi lấy SP cùng loại:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRelated();
    }, [firstProduct]);

    const handleSelect = (product) => {
        if (selectedItems.find(p => p._id === product._id)) {
            setSelectedItems(selectedItems.filter(p => p._id !== product._id));
        } else {
            if (selectedItems.length < 2) { // Cho chọn thêm tối đa 2 máy nữa (Tổng là 3)
                setSelectedItems([...selectedItems, product]);
            } else {
                alert("So sánh tối đa 3 máy thôi sếp ơi!");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">So sánh sản phẩm</h3>
                        <p className="text-xs text-blue-600 font-medium">Danh mục: {firstProduct.category.name || "Điện thoại"}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={20} /></button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Máy 1 (Đã chọn) */}
                    <div className="border-2 border-yellow-500 rounded-xl p-3 bg-yellow-50 relative">
                        <span className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full">Máy 1</span>
                        <img src={firstProduct.image} className="h-24 mx-auto object-contain mb-2" />
                        <p className="text-xs font-bold text-center truncate">{firstProduct.name}</p>
                    </div>

                    {/* Danh sách gợi ý */}
                    {loading ? <p className="col-span-2 text-center py-10">Đang tìm máy cùng loại...</p> :
                        listSameCategory.map(p => {
                            const isSelected = selectedItems.find(item => item._id === p._id);
                            return (
                                <div
                                    key={p._id}
                                    onClick={() => handleSelect(p)}
                                    className={`border-2 rounded-xl p-3 cursor-pointer transition relative group ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                                >
                                    {isSelected && <FaCheckCircle className="absolute top-2 right-2 text-blue-500" />}
                                    <img src={p.image} className="h-24 mx-auto object-contain mb-2 group-hover:scale-105 transition" />
                                    <p className="text-xs font-semibold text-center truncate">{p.name}</p>
                                    <p className="text-[10px] text-red-500 text-center font-bold">{new Intl.NumberFormat('vi-VN').format(p.price)}đ</p>
                                </div>
                            );
                        })
                    }
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-600">Hủy</button>
                    <button
                        disabled={selectedItems.length === 0}
                        onClick={() => onStartCompare([firstProduct, ...selectedItems])}
                        className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
                    >
                        Bắt đầu so sánh ({selectedItems.length + 1})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompareModal;