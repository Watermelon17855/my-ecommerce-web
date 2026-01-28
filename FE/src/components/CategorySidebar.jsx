import React from 'react';
import { List, ChevronRight, LayoutGrid, ChevronLeft } from 'lucide-react';

const CategorySidebar = ({ categories, activeCategory, onCategoryChange, onToggle }) => {
    return (
        <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-24">

                {/* HEADER CỦA SIDEBAR + NÚT ĐÓNG */}
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-base font-black flex items-center gap-2 text-gray-800 uppercase tracking-widest">
                        <List size={18} className="text-blue-500" /> Danh mục
                    </h3>
                    <button
                        onClick={onToggle}
                        className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 transition-all"
                        title="Thu gọn"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>

                <ul className="space-y-3">
                    {/* Nút Tất cả */}
                    <li>
                        <button
                            onClick={() => onCategoryChange("all")}
                            className={`w-full flex items-center justify-between px-5 py-4 rounded-[1.5rem] text-sm font-bold transition-all duration-300 ${activeCategory === "all"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                                }`}
                        >
                            <span className="flex items-center gap-3">
                                <LayoutGrid size={18} /> Tất cả
                            </span>
                            {activeCategory === "all" && <ChevronRight size={14} />}
                        </button>
                    </li>

                    {/* Danh sách danh mục */}
                    {categories.map((cat) => (
                        <li key={cat._id}>
                            <button
                                onClick={() => onCategoryChange(cat._id)}
                                className={`w-full flex items-center justify-between px-5 py-4 rounded-[1.5rem] text-sm font-bold transition-all duration-300 ${activeCategory === cat._id
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                                    }`}
                            >
                                <span className="truncate">{cat.name}</span>
                                {activeCategory === cat._id && <ChevronRight size={14} />}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default CategorySidebar;