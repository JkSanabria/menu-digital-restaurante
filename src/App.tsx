import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import SectionView from './pages/SectionView';
import ProductList from './pages/ProductList';
import PizzaCustomizer from './pages/PizzaCustomizer';
import CartPage from './pages/CartPage.tsx';
import FloatingCart from './components/FloatingCart';
import { CartProvider } from './context/CartContext';
import './index.css';

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <RedirectToHomeOnReload />
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="pizzas" element={<PizzaCustomizer />} />
                        <Route path="section/:sectionId" element={<SectionView />} />
                        <Route path="section/:sectionId/sub/:subId" element={<ProductList />} />
                        <Route path="cart" element={<CartPage />} />
                    </Route>

                    {/* Floating Cart only visible OUTSIDE Cart Page */}
                    {/* Note: In a real app we might want to conditionally render this based on route */}
                </Routes>

                {/* Floating Cart Button Logic - Shown globally except on Cart Page */}
                <FloatingCartWrapper />
            </BrowserRouter>
        </CartProvider>
    );
}

// Redirect to home on hard reload
function RedirectToHomeOnReload() {
    const location = useLocation();
    const navigate = useNavigate();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (hasRedirected.current) return;
        hasRedirected.current = true;
        if (location.pathname !== '/') {
            navigate('/', { replace: true });
        }
    }, [location.pathname, navigate]);

    return null;
}

// Helper to hide floating cart on /cart route
function FloatingCartWrapper() {
    const location = useLocation();
    if (location.pathname === '/cart') return null;
    return <FloatingCart />;
}

export default App;
