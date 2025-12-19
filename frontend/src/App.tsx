import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StoreList from './components/StoreList';
import ProductList from './components/ProductList';

function Layout() {
  const location = useLocation();

  return (
    <div className="app">
      <header className="header">
        <h1>Inventory Management System</h1>
        <nav className="nav-tabs">
          <Link
            to="/dashboard"
            className={`tab ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/stores"
            className={`tab ${location.pathname === '/stores' ? 'active' : ''}`}
          >
            Stores
          </Link>
          <Link
            to="/products"
            className={`tab ${location.pathname === '/products' ? 'active' : ''}`}
          >
            Products
          </Link>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stores" element={<StoreList />} />
          <Route path="/products" element={<ProductList />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
