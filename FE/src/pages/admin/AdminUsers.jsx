import React, { useEffect, useState } from 'react';
import { Trash2, ShieldCheck, ShieldAlert, User as UserIcon } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const API_URL = "https://my-ecommerce-web-rlmf.onrender.com";
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user')); // Lấy thông tin admin đang đăng nhập

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/auth/all-users`, {
                headers: { 'token': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsers(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchUsers(); }, []);

    // HÀM SET/HỦY QUYỀN ADMIN
    const handleToggleAdmin = async (id) => {
        if (window.confirm("Bạn muốn thay đổi quyền hạn của thành viên này?")) {
            try {
                const res = await fetch(`${API_URL}/api/auth/toggle-admin/${id}`, {
                    method: 'PUT',
                    headers: { 'token': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.message);
                    fetchUsers(); // Tải lại danh sách
                } else {
                    alert(data.message);
                }
            } catch (err) { console.error(err); }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa thành viên này nhé?")) {
            await fetch(`${API_URL}/api/auth/${id}`, {
                method: 'DELETE',
                headers: { 'token': `Bearer ${token}` }
            });
            fetchUsers();
        }
    };

    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 italic">Quản lý thành viên 👥</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-xs uppercase font-bold border-b border-gray-50">
                            <th className="px-6 py-4">Tên & Email</th>
                            <th className="px-6 py-4">Vai trò</th>
                            <th className="px-6 py-4 text-center">Phân quyền / Xóa</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((u) => (
                            <tr key={u._id} className="hover:bg-gray-50/50 transition-all">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-800">{u.name}</div>
                                    <div className="text-xs text-gray-400">{u.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {u.isAdmin ? (
                                        <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-lg uppercase">Admin</span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-lg uppercase">Khách hàng</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center space-x-3">
                                        {/* NÚT SET/HỦY ADMIN */}
                                        <button
                                            onClick={() => handleToggleAdmin(u._id)}
                                            className={`p-2 rounded-xl transition-colors ${u.isAdmin ? 'text-orange-500 hover:bg-orange-50' : 'text-blue-500 hover:bg-blue-50'}`}
                                            title={u.isAdmin ? "Hạ cấp xuống User" : "Nâng cấp lên Admin"}
                                        >
                                            {u.isAdmin ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
                                        </button>

                                        {/* NÚT XÓA (Chỉ hiện nếu không phải là chính mình) */}
                                        {u._id !== currentUser.id && (
                                            <button onClick={() => handleDelete(u._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;