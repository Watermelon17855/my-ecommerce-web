import { useCart } from "../../context/CartContext";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

    const handleCheckout = () => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert("Vui lòng đăng nhập để tiếp tục thanh toán!");
            navigate('/login');
            return;
        }
        if (cartItems.length === 0) return alert("Giỏ hàng rỗng!");

        navigate('/shipping', {
            state: {
                cartItems: cartItems,
                totalPrice: totalPrice
            }
        });
    };

    // --- VIEW KHI GIỎ TRỐNG (Style Clean White) ---
    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-gray-50 min-h-[60vh]">
                <div className="bg-white p-10 rounded-full mb-6 shadow-sm border border-gray-100">
                    <ShoppingBag size={60} className="text-gray-200" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 italic tracking-tight">Giỏ hàng của sếp đang trống 🛒</h2>
                <Link to="/" className="mt-6 text-blue-600 flex items-center hover:text-blue-700 font-bold transition-all uppercase text-xs tracking-widest">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại chọn máy ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="py-10 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Tiêu đề trang: Đen đậm & Thanh lịch */}
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-10 w-1.5 bg-blue-600 rounded-full shadow-sm"></div>
                    <h1 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase">Giỏ hàng <span className="text-blue-600">của sếp</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* --- DANH SÁCH SẢN PHẨM (Bên trái) --- */}
                    <div className="lg:col-span-2 space-y-5">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex items-center bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                {/* Khung ảnh: Nền xám nhẹ */}
                                <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-2xl p-3 border border-gray-100">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                </div>

                                {/* Thông tin sản phẩm */}
                                <div className="ml-8 flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                    <p className="text-blue-600 font-black text-xl mt-1 tracking-tight">{item.price?.toLocaleString()}đ</p>

                                    {/* Cụm tăng giảm số lượng: Style Minimalism */}
                                    <div className="flex items-center space-x-5 mt-5 bg-gray-50 w-fit rounded-xl p-1.5 border border-gray-100">
                                        <button
                                            disabled={item.quantity <= 1}
                                            className={`p-1.5 rounded-lg transition-all ${item.quantity <= 1
                                                ? "text-gray-200 cursor-not-allowed"
                                                : "text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                                                }`}
                                            onClick={() => {
                                                if (item.quantity > 1) {
                                                    if (window.confirm("Giảm số lượng máy xuống sếp nhé?")) {
                                                        updateQuantity(item._id, item.quantity - 1);
                                                    }
                                                }
                                            }}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-black text-gray-900 w-6 text-center text-sm">{item.quantity}</span>
                                        {/* <button className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm"><Plus className="w-4 h-4" /></button> */}
                                    </div>
                                </div>

                                {/* Nút xóa: Hiện rõ hơn trên nền trắng */}
                                <button
                                    onClick={() => {
                                        if (window.confirm("Xóa máy này khỏi giỏ hàng hả sếp? 😢")) {
                                            removeFromCart(item._id);
                                        }
                                    }}
                                    className="ml-4 p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* --- TỔNG CỘNG (Bên phải) --- */}
                    <div className="relative">
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-md sticky top-28">
                            <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-widest italic">Tóm tắt đơn hàng</h2>

                            <div className="space-y-5">
                                <div className="flex justify-between items-center text-gray-500 font-medium">
                                    <span className="text-xs uppercase tracking-widest">Tạm tính:</span>
                                    <span className="text-gray-900 font-bold">{totalPrice.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500 font-medium">
                                    <span className="text-xs uppercase tracking-widest">Vận chuyển:</span>
                                    <span className="text-green-600 text-[10px] font-black uppercase tracking-widest bg-green-50 px-2 py-1 rounded-md">Miễn phí</span>
                                </div>

                                <div className="h-px bg-gray-100 my-8" />

                                <div className="flex justify-between items-end mb-10">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Tổng cộng:</span>
                                    <span className="text-3xl font-black text-blue-600 tracking-tighter">
                                        {totalPrice.toLocaleString()}đ
                                    </span>
                                </div>

                                {/* Nút chính: Đen quyền lực cho đúng gu Apple/Minimalism */}
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-gray-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-gray-200 active:scale-95"
                                >
                                    Thanh toán ngay
                                </button>

                                <Link to="/" className="block text-center mt-8 text-gray-400 hover:text-blue-600 text-[10px] font-bold uppercase tracking-widest transition-colors">
                                    ← Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;