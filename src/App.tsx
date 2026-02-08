import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import SectionView from './pages/SectionView';
import ProductList from './pages/ProductList';
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="section/:sectionId" element={<SectionView />} />
                    <Route path="section/:sectionId/sub/:subId" element={<ProductList />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
