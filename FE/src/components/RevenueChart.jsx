import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueChart = () => {
    const [data, setData] = useState([]);
    // Mặc định lấy dữ liệu 7 ngày gần nhất
    const [from, setFrom] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [to, setTo] = useState(new Date().toISOString().split('T')[0]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`https://my-ecommerce-web-rlmf.onrender.com/api/payment/revenue-chart?from=${from}&to=${to}`, {
                headers: { 'token': `Bearer ${token}` }
            });
            const result = await res.json();
            setData(result);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, [from, to]);

    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h3 className="text-xl font-bold text-gray-800 italic">Xu hướng doanh thu 📈</h3>

                <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-2xl">
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-transparent border-none text-sm font-bold text-blue-600 focus:ring-0" />
                    <span className="text-gray-400">đến</span>
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="bg-transparent border-none text-sm font-bold text-blue-600 focus:ring-0" />
                </div>
            </div>

            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(value) => `${value / 1000}k`} />
                        <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

                        {/* Đường doanh thu Chuyển khoản */}
                        <Line type="monotone" dataKey="transfer" name="Chuyển khoản" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />

                        {/* Đường doanh thu Tiền mặt */}
                        <Line type="monotone" dataKey="cash" name="Tiền mặt (COD)" stroke="#f97316" strokeWidth={4} dot={{ r: 6, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;