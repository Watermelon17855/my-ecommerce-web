import React from 'react';

const AdminDashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Chào Sếp! 👋</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Doanh thu */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 font-medium">Tổng doanh thu</p>
                    <h3 className="text-2xl font-bold text-blue-600 mt-2">15,000,000đ</h3>
                </div>

                {/* Card 2: Đơn hàng */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 font-medium">Đơn hàng mới</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-2">12 đơn</h3>
                </div>

                {/* Card 3: Khách hàng */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 font-medium">Khách thành viên</p>
                    <h3 className="text-2xl font-bold text-purple-600 mt-2">85 người</h3>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;