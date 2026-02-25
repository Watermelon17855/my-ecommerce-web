import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    // 1. Lấy thông tin sếp từ kho ra
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    // 2. Kiểm tra: Phải có user VÀ isAdmin phải là true
    if (user && user.isAdmin === true) {
        return <Outlet />; // ✅ Đúng sếp tổng, mời vào (hiện các trang admin con)
    }

    // 3. Nếu là khách tò mò: Đá văng ra trang Login
    alert("Khu vực cấm! Chỉ dành cho Sếp Tổng. ⛔");
    return <Navigate to="/login" replace />;
};

export default AdminRoute;