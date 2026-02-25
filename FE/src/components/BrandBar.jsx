import React, { useState, useEffect } from 'react';

const BrandBar = () => {
    const [brands, setBrands] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await fetch(`${API_URL}/api/brands`);
                const data = await res.json();
                setBrands(data);
            } catch (error) {
                console.error("Lỗi lấy nhãn hàng:", error);
            }
        };
        fetchBrands();
    }, [API_URL]);

    if (brands.length === 0) return null;

    return (
        // 🔥 NỀN TRẮNG TINH KHÔI + VIỀN XÁM NHẠT
        <div className="bg-white border-y border-gray-100 py-10 mb-8 overflow-hidden relative group">
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 40s linear infinite;
                }
                .group:hover .animate-marquee {
                    animation-play-state: paused;
                }
                `}
            </style>

            <div className="max-w-7xl mx-auto px-4">
                <div className="animate-marquee">
                    {[...brands, ...brands, ...brands].map((brand, index) => (
                        <div
                            key={`${brand._id}-${index}`}
                            className="flex-shrink-0 mx-6 md:mx-10 flex justify-center items-center"
                        >
                            {/* 🧊 LOGO BOX: Trắng trên nền trắng nhưng có bóng đổ nhẹ để tạo khối */}
                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-500/30 transition-all duration-300 group/item shadow-sm hover:shadow-md">
                                <img
                                    src={brand.logo.startsWith('http') ? brand.logo : `${API_URL}/${brand.logo}`}
                                    alt={brand.name}
                                    className="h-8 md:h-10 w-auto object-contain transition-all duration-500 group-hover/item:scale-110 "
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ✨ HIỆU ỨNG MỜ 2 ĐẦU: Đổi từ Deep Navy sang White (Trắng) */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        </div>
    );
};

export default BrandBar;