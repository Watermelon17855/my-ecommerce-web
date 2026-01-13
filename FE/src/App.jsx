import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} /> {/* Trang mặc định /admin */}
              <Route path="orders" element={<AdminOrders />} /> {/* Trang /admin/orders */}
              <Route path="products" element={<AdminProducts />} /> {/* Trang /admin/products */}
              <Route path="users" element={<AdminUsers />} /> {/* Trang /admin/users */}
            </Route>
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;