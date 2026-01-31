import React, { useState } from 'react';
import { ChevronLeft, LayoutGrid, ChevronDown } from 'lucide-react';

const CategorySidebar = ({ categories, activeCategory, onCategoryChange, onToggle }) => {
    // State này chỉ lo việc đóng/mở danh sách món bên trong thôi sếp nhé
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 h-fit relative">

            {/* --- 1. NÚT MŨI TÊN ĐÓNG SIDEBAR (Thay cho dấu X) --- */}
            <button
                onClick={onToggle}
                className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded-lg transition-all"
                title="Thu gọn Sidebar"
            >
                <ChevronLeft size={24} />
            </button>

            <div className="flex flex-col">
                {/* --- 2. NHẤN VÀO ĐÂY ĐỂ ĐÓNG/MỞ DANH SÁCH --- */}
                <div
                    className="flex items-center gap-3 cursor-pointer group w-fit pr-10"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <LayoutGrid size={20} />
                    </div>
                    <h3 className="font-black text-gray-800 uppercase tracking-wider text-sm select-none">
                        Danh mục
                    </h3>

                    {/* Một cái mũi tên nhỏ để báo hiệu là nhấn vào đây được */}
                    <ChevronDown
                        size={16}
                        className={`text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                </div>

                {/* --- 3. DANH SÁCH DANH MỤC --- */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-2">
                        <button
                            onClick={() => onCategoryChange("all")}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeCategory === "all"
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]"
                                : "text-gray-500 hover:bg-gray-50"
                                }`}
                        >
                            <span>Tất cả</span>
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => onCategoryChange(cat._id)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeCategory === cat._id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]"
                                    : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                <span className="truncate mr-2">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategorySidebar;