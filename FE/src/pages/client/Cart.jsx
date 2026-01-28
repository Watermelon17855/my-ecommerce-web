import { useCart } from "../../context/CartContext";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

    // --- SỬA LẠI LOGIC TẠI ĐÂY ---
    const handleCheckout = () => {
        // 1. Kiểm tra đăng nhập
        const userData = localStorage.getItem('user');

        if (!userData) {
            alert("Vui lòng đăng nhập để tiếp tục thanh toán!");
            navigate('/login');
            return;
        }

        // 2. Kiểm tra giỏ hàng trống
        if (cartItems.length === 0) return alert("Giỏ hàng rỗng!");

        // 3. CHUYỂN SANG TRANG SHIPPING
        // Thay vì gọi API, mình mang theo cartItems và totalPrice sang trang tiếp theo
        navigate('/shipping', {
            state: {
                cartItems: cartItems,
                totalPrice: totalPrice
            }
        });
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Giỏ hàng của bạn đang trống 🛒</h2>
                <Link to="/" className="mt-4 text-blue-600 flex items-center hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="py-10">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 italic">Giỏ hàng của bạn ✨</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <img src={item.img} alt={item.name} className="w-24 h-24 object-contain rounded-lg bg-gray-50" />
                            <div className="ml-6 flex-1">
                                <h3 className="font-bold text-gray-800">{item.name}</h3>
                                <p className="text-blue-600 font-bold">{item.price?.toLocaleString()}đ</p>
                                <div className="flex items-center space-x-3 mt-4">
                                    <button
                                        // Nút này sẽ bị khóa (mờ đi) nếu số lượng là 1 hoặc nhỏ hơn
                                        disabled={item.quantity <= 1}
                                        className={`p-2 rounded-lg transition-all ${item.quantity <= 1
                                            ? "text-gray-300 cursor-not-allowed"
                                            : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                        onClick={() => {
                                            // Chỉ thực hiện khi số lượng trên 1 (thêm một lớp bảo vệ nữa cho chắc)
                                            if (item.quantity > 1) {
                                                const isConfirmed = window.confirm("Bạn có muốn giảm số lượng sản phẩm này không?");
                                                if (isConfirmed) {
                                                    updateQuantity(item._id, item.quantity - 1);
                                                }
                                            }
                                        }}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                                    {/* <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button> */}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không? 😢")) {
                                        removeFromCart(item._id);
                                    }
                                }}
                                className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <Trash2 className="w-6 h-6" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold mb-4">Tổng cộng</h2>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tạm tính:</span>
                        <span className="font-medium text-gray-800">{totalPrice.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between mb-6 border-t pt-4">
                        <span className="text-lg font-bold">Thành tiền:</span>
                        <span className="text-lg font-bold text-blue-600">{totalPrice.toLocaleString()}đ</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="block w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 text-center transition-all"
                    >
                        Thanh toán ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;