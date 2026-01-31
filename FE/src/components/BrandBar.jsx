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
        <div className="bg-white border-b border-gray-100 py-8 mb-8 overflow-hidden relative group">
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 30s linear infinite;
                }
                /* Vẫn giữ tính năng dừng lại khi rê chuột để khách dễ nhìn sếp nhé */
                .group:hover .animate-marquee {
                    animation-play-state: paused;
                }
                `}
            </style>

            <div className="max-w-7xl mx-auto px-4">
                <div className="animate-marquee">
                    {[...brands, ...brands].map((brand, index) => (
                        <div
                            key={`${brand._id}-${index}`}
                            className="flex-shrink-0 mx-8 md:mx-12 flex justify-center items-center"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                // 🔥 ĐÃ SỬA: Bỏ grayscale và opacity, giữ lại scale để rê chuột vào vẫn thấy "phê"
                                className="h-8 md:h-12 w-auto object-contain transition-all duration-300 cursor-pointer hover:scale-110"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Gradient mờ 2 đầu giúp hiệu ứng mượt mà hơn */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        </div>
    );
};

export default BrandBar;