import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute';
import AIChat from './components/AIChat';

import Home from './pages/client/Home';
import ProductDetail from './pages/client/ProductDetail';
import { CartProvider } from './context/CartContext';
import Cart from './pages/client/Cart';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import Checkout from './pages/client/Checkout';
import Shipping from './pages/client/Shipping';
import Landing from './pages/client/Landing';
import ComparePage from './pages/client/ComparePage';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';


const AppContent = () => {
  const location = useLocation();

  // 1. Thêm "/" vào danh sách ẩn Navbar nếu sếp muốn Landing Page hiển thị toàn màn hình (Full-screen)
  // giúp khách tập trung vào thông điệp của shop hơn.
  const hideNavbarRoutes = ['/login', '/register', '/'];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-100 transition-colors duration-500">

      {shouldShowNavbar && <Navbar />}

      <main className="relative">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 2. ĐẢO VỊ TRÍ: "/" bây giờ sẽ hiện Landing Page đầu tiên */}
          <Route path="/" element={<Landing />} />

          {/* 3. ĐỔI PATH: Trang danh sách sản phẩm bây giờ sẽ nằm ở /shop (hoặc /home) */}
          <Route path="/home" element={<Home />} />

          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/landing" element={<Landing />} /> {/* Giữ lại cái này cũng được hoặc bỏ đi vì đã là / */}
          <Route path="/compare" element={<ComparePage />} />

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

        {/* Chỉ hiện Chatbot AI khi không ở Landing Page để tránh che mất nội dung quảng cáo */}
        {location.pathname !== '/' && <AIChat />}
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