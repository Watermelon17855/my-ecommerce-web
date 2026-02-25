import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/client/Home';
import ProductDetail from './pages/client/ProductDetail';
import { CartProvider } from './context/CartContext';
import Cart from './pages/client/Cart';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import Checkout from './pages/client/Checkout';
import Shipping from './pages/client/Shipping';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';
import AdminRoute from './components/AdminRoute';

// --- COMPONENT PHỤ ĐỂ XỬ LÝ LOGIC HIỂN THỊ ---
const AppContent = () => {
  const location = useLocation();

  // Danh sách các trang KHÔNG muốn hiện Navbar (Đăng nhập, Đăng ký)
  const hideNavbarRoutes = ['/login', '/register'];

  // Kiểm tra xem path hiện tại có nằm trong danh sách ẩn không
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    // 🔥 ĐỔI: bg-[#0a0e1a] -> bg-gray-50 (Xám cực nhạt giúp các Card trắng nổi bật)
    // 🔥 ĐỔI: text-white -> text-gray-900 (Chữ đen đậm thanh lịch)
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-100 transition-colors duration-500">

      {/* 🗑️ ĐÃ XÓA: Các khối GLOW xanh/tím để web sạch sẽ, không bị rối */}

      {shouldShowNavbar && <Navbar />}

      <main className="relative">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/shipping" element={<Shipping />} />

          {/* Layout Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="brands" element={<AdminBrands />} />
            </Route>
          </Route>
        </Routes>
      </main>

    </div>
  );
};

// --- COMPONENT CHÍNH ---
function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;