import { useCart } from "../../context/CartContext";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // 1. Đã thêm useNavigate

const Cart = () => {
    // Lấy các hàm và dữ liệu từ Context
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate(); // 2. Khởi tạo điều hướng

    // Tính tổng tiền
    const totalPrice = cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

    // 3. LOGIC THANH TOÁN: Gửi dữ liệu lên Server rồi mới chuyển trang
    const handleCheckout = async () => {
        if (cartItems.length === 0) return alert("Giỏ hàng của bạn đang trống!");

        // Chuẩn bị dữ liệu để gửi lên backend
        const orderPayload = {
            userId: user._id,
            items: cartItems,
            totalAmount: totalPrice,
        };

        try {
            // 1. GỌI API ĐỂ TẠO ĐƠN HÀNG TRONG MONGODB
            // Lưu ý: Dùng link Render của bạn đã deploy
            const response = await fetch("https://my-ecommerce-web-rlmf.onrender.com/api/payment/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderPayload),
            });

            if (response.ok) {
                const savedOrder = await response.json();
                console.log("Đã tạo đơn hàng thành công trong MongoDB:", savedOrder);

                // 2. CHUYỂN TRANG: Dùng dữ liệu THẬT từ server trả về (có mã DH và ID thật)
                navigate('/checkout', { state: { orderData: savedOrder } });
            } else {
                const errorData = await response.json();
                alert(`Lỗi: ${errorData.message || "Không thể tạo đơn hàng"}`);
            }
        } catch (error) {
            console.error("Lỗi kết nối server:", error);
            alert("Không thể kết nối đến server. Bạn đã bật server Backend chưa?");
        }
    };

    // Giao diện khi giỏ hàng trống
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
                {/* Danh sách sản phẩm */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <img src={item.img} alt={item.name} className="w-24 h-24 object-contain rounded-lg bg-gray-50" />
                            <div className="ml-6 flex-1">
                                <h3 className="font-bold text-gray-800">{item.name}</h3>
                                <p className="text-blue-600 font-bold">{item.price?.toLocaleString()}đ</p>

                                <div className="flex items-center space-x-3 mt-4">
                                    <button
                                        disabled={item.quantity <= 1}
                                        className={`p-2 rounded-lg transition-all ${item.quantity <= 1
                                            ? "text-gray-300 cursor-not-allowed"
                                            : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                        // 4. SỬA LOGIC: Giảm số lượng đi 1
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>

                                    <span className="font-bold w-8 text-center">{item.quantity}</span>

                                    <button
                                        // 5. THÊM NÚT TĂNG: Tăng số lượng thêm 1
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item._id)}
                                className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-full"
                            >
                                <Trash2 className="w-6 h-6" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Phần tổng kết (Thanh toán) */}
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

                    {/* 6. SỬA CHỖ NÀY: Link -> button để chạy hàm handleCheckout */}
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