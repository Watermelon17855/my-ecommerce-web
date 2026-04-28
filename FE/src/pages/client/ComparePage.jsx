import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ComparePage = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            const ids = searchParams.get('ids')?.split(',') || [];
            try {
                // Sếp có thể tạo 1 API nhận mảng IDs hoặc gọi nhiều lần (Promise.all)
                const requests = ids.map(id => axios.get(`http://localhost:5001/api/products/${id}`));
                const responses = await Promise.all(requests);
                setProducts(responses.map(res => res.data));
            } catch (err) {
                console.error("Lỗi lấy dữ liệu so sánh:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [searchParams]);

    if (loading) return <div className="p-20 text-center">Đang nạp dữ liệu so sánh...</div>;

    // Các thông số cần so sánh (Sếp sửa theo field trong MongoDB của sếp)
    const specs = [
        { label: 'Giá niêm yết', key: 'price', format: (val) => `${new Intl.NumberFormat('vi-VN').format(val)}đ`, highlight: true },
        { label: 'Màn hình', key: 'screen' },
        { label: 'Camera', key: 'camera' },
        { label: 'Chipset', key: 'cpu' },
        { label: 'RAM / ROM', key: 'ram_rom' },
        { label: 'Dung lượng Pin', key: 'battery' },
    ];

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-extrabold mb-8 text-gray-800">So sánh chi tiết sản phẩm</h1>

            <div className="bg-white rounded-2xl shadow-xl overflow-x-auto border">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-6 border-b w-1/4 text-gray-400 font-medium">Sản phẩm</th>
                            {products.map(p => (
                                <th key={p._id} className="p-6 border-b text-center border-l min-w-[250px]">
                                    <img src={p.image} className="h-40 mx-auto object-contain mb-4" />
                                    <h2 className="text-lg font-bold text-gray-800">{p.name}</h2>
                                    <button className="mt-4 text-sm bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">Mua ngay</button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {specs.map((spec, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition">
                                <td className="p-4 border-b font-bold text-gray-600 bg-gray-50/50">{spec.label}</td>
                                {products.map(p => (
                                    <td key={p._id} className={`p-4 border-b border-l text-center text-sm ${spec.highlight ? 'text-red-600 font-extrabold text-base' : 'text-gray-700'}`}>
                                        {spec.format ? spec.format(p[spec.key]) : (p[spec.key] || 'N/A')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparePage;