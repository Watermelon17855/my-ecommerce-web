import React, { useEffect, useState } from 'react';
import { Eye, X, Package, User, Phone, MapPin, ShoppingCart } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null); // State để quản lý đơn hàng đang xem

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/all-orders`, {
                    headers: {
                        'token': `Bearer ${token}`
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

    if (loading) return <div className="text-center py-20 font-medium text-gray-500 animate-pulse">Đang tải dữ liệu đơn hàng...</div>;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Package className="text-blue-500" /> Danh sách đơn hàng
                </h2>
                <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">
                    {orders.length} đơn hàng
                </span>
            </div>

            {/* Bảng danh sách */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Mã đơn</th>
                            <th className="px-6 py-4">Khách hàng</th>
                            <th className="px-6 py-4">Tổng tiền</th>
                            <th className="px-6 py-4">Thanh toán</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-blue-50/30 transition-all text-sm group">
                                <td className="px-6 py-4 font-mono font-bold text-blue-600 uppercase">
                                    {order.orderCode}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-800">{order.fullname}</div>
                                    <div className="text-xs text-gray-500">{order.phone}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-700">
                                    {order.totalAmount?.toLocaleString()}đ
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.paymentMethod === 'transfer' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {order.paymentMethod === 'transfer' ? 'Chuyển khoản' : 'Tiền mặt'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ xử lý'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        title="Xem chi tiết sản phẩm"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {orders.length === 0 && (
                <div className="text-center py-20 text-gray-400 font-medium">Chưa có đơn hàng nào được đặt.</div>
            )}

            {/* --- MODAL CHI TIẾT ĐƠN HÀNG --- */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h3>
                                <p className="text-xs text-blue-600 font-mono font-bold mt-1 uppercase">#{selectedOrder.orderCode}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-gray-400 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8 custom-scrollbar">
                            {/* Section 1: Thông tin giao hàng */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50">
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                        <User size={14} /> Người nhận
                                    </h4>
                                    <p className="font-bold text-gray-800">{selectedOrder.fullname}</p>
                                    <p className="text-sm text-gray-600 flex items-center gap-1"><Phone size={14} /> {selectedOrder.phone}</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={14} /> Địa chỉ giao
                                    </h4>
                                    <p className="text-sm text-gray-800 leading-relaxed font-medium">{selectedOrder.address}</p>
                                </div>
                            </div>

                            {/* Section 2: Danh sách sản phẩm */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <ShoppingCart size={18} className="text-blue-500" /> Danh sách sản phẩm
                                </h4>
                                <div className="space-y-3">
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-blue-600 border border-gray-100 shadow-sm">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{item.name}</p>
                                                        <p className="text-xs text-gray-500 font-medium">Số lượng: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-800">{(item.price * item.quantity).toLocaleString()}đ</p>
                                                    <p className="text-[10px] text-gray-400 uppercase italic">Giá gốc: {item.price?.toLocaleString()}đ</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-400 py-4 italic">Không tìm thấy thông tin sản phẩm.</p>
                                    )}
                                </div>
                            </div>

                            {/* Section 3: Tổng kết */}
                            <div className="pt-6 border-t border-dashed border-gray-200 flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Phương thức: <span className="text-gray-800">{selectedOrder.paymentMethod}</span></p>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Ngày đặt: <span className="text-gray-800">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-500 mb-1">Tổng cộng:</p>
                                    <p className="text-3xl font-black text-blue-600">{selectedOrder.totalAmount?.toLocaleString()}đ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;