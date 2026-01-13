import React, { useEffect, useState } from 'react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch("https://my-ecommerce-web-rlmf.onrender.com/api/payment/all-orders", {
                    headers: {
                        'token': `Bearer ${token}` // Gửi token để vượt qua middleware isAdmin
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setOrders(data);
                }
            } catch (error) {
                console.error("Lỗi fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="text-center py-10">Đang tải dữ liệu đơn hàng...</div>;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Danh sách đơn hàng 📦</h2>
                <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">
                    {orders.length} đơn hàng
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Mã đơn</th>
                            <th className="px-6 py-4">Khách hàng</th>
                            <th className="px-6 py-4">Tổng tiền</th>
                            <th className="px-6 py-4">Thanh toán</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4">Ngày đặt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-all text-sm">
                                <td className="px-6 py-4 font-mono font-bold text-blue-600 uppercase">
                                    {order.orderCode}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-800">{order.fullname}</div>
                                    <div className="text-xs text-gray-500">{order.phone}</div>
                                    <div className="text-xs text-gray-400 truncate w-40">{order.address}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-700">
                                    {order.totalAmount?.toLocaleString()}đ
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.paymentMethod === 'transfer' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                                        }`}>
                                        {order.paymentMethod === 'transfer' ? 'Chuyển khoản' : 'Tiền mặt (COD)'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ xử lý'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs">
                                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {orders.length === 0 && (
                <div className="text-center py-20 text-gray-400">Chưa có đơn hàng nào được đặt.</div>
            )}
        </div>
    );
};

export default AdminOrders;