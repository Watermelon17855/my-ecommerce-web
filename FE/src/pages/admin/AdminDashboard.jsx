import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    // 1. Khai báo State
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalUsers: 0 });
    const [chartData, setChartData] = useState([]);
    const [from, setFrom] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [to, setTo] = useState(new Date().toISOString().split('T')[0]);

    const API_URL = "https://my-ecommerce-web-rlmf.onrender.com";
    const token = localStorage.getItem('token');

    // 2. Hàm lấy dữ liệu thống kê (Thẻ Card)
    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_URL}/api/payment/stats`, {
                headers: { 'token': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setStats(data);
        } catch (err) { console.error("Lỗi lấy stats:", err); }
    };

    // 3. Hàm lấy dữ liệu Biểu đồ
    const fetchChartData = async () => {
        try {
            const res = await fetch(`${API_URL}/api/payment/revenue-chart?from=${from}&to=${to}`, {
                headers: { 'token': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setChartData(data);
        } catch (err) { console.error("Lỗi lấy biểu đồ:", err); }
    };

    useEffect(() => {
        fetchStats();
        fetchChartData();
    }, [from, to]); // Khi đổi ngày, biểu đồ tự load lại

    return (
        <div className="p-4 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 italic">Chào Sếp! 👋</h1>

            {/* --- GRID THẺ THỐNG KÊ --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Thẻ Doanh thu */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl"><DollarSign size={28} /></div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Tổng doanh thu</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalRevenue?.toLocaleString()}đ</h3>
                    </div>
                </div>

                {/* Thẻ Đơn hàng */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-4 bg-green-100 text-green-600 rounded-2xl"><ShoppingBag size={28} /></div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Đơn hàng mới</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalOrders} đơn</h3>
                    </div>
                </div>

                {/* Thẻ Khách hàng */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl"><Users size={28} /></div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Khách thành viên</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers} người</h3>
                    </div>
                </div>
            </div>

            {/* --- PHẦN BIỂU ĐỒ DOANH THU --- */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp className="text-blue-500" /> Phân tích doanh thu
                        </h2>
                        <p className="text-sm text-gray-400">So sánh Tiền mặt vs Chuyển khoản</p>
                    </div>

                    {/* Bộ chọn ngày */}
                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        <Calendar size={18} className="text-gray-400" />
                        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-transparent border-none text-sm font-bold text-blue-600 focus:ring-0 cursor-pointer" />
                        <span className="text-gray-400">→</span>
                        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="bg-transparent border-none text-sm font-bold text-blue-600 focus:ring-0 cursor-pointer" />
                    </div>
                </div>

                {/* Vùng vẽ biểu đồ */}
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                            <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

                            {/* Đường Chuyển khoản */}
                            <Line type="monotone" dataKey="transfer" name="Chuyển khoản" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 8 }} />

                            {/* Đường Tiền mặt */}
                            <Line type="monotone" dataKey="cash" name="Tiền mặt (COD)" stroke="#f97316" strokeWidth={4} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;