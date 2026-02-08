import { useParams, Navigate } from 'react-router-dom';
import menuData from '../data/menu.json';
import { MenuData } from '../types/menu';

const data: MenuData = menuData as unknown as MenuData;

// Currency formatter
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export default function ProductList() {
    const { sectionId, subId } = useParams();

    const section = data.find(s => s.id === sectionId);
    const subcategory = section?.subcategories.find(sub => sub.id === subId);

    if (!section || !subcategory) return <Navigate to="/" replace />;

    return (
        <div className="container mx-auto px-4 py-6 max-w-lg animate-in fade-in slide-in-from-right-8 duration-300 pb-20">
            <div className="mb-6">
                <span className="text-xs font-bold text-primary uppercase tracking-wider bg-orange-100 px-2 py-1 rounded">
                    {section.name}
                </span>
                <h1 className="text-3xl font-heading text-gray-900 mt-2">{subcategory.name}</h1>
            </div>

            <div className="flex flex-col gap-8">
                {subcategory.categories.map((category) => (
                    <div key={category.id} className="scroll-mt-20" id={category.id}>
                        <h2 className="text-xl font-bold text-primary mb-4 border-b-2 border-primary/10 pb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent block"></span>
                            {category.name}
                        </h2>

                        <div className="grid gap-4">
                            {category.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md active:scale-[0.99]"
                                >
                                    {/* Image Placeholder or Actual Image */}
                                    <div className="w-24 h-24 shrink-0 rounded-lg bg-gray-100 overflow-hidden relative">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Attributes Badges */}
                                        {product.attributes && product.attributes.length > 0 && (
                                            <div className="absolute top-0 left-0 p-1 flex flex-wrap gap-1">
                                                {product.attributes.includes('recomendado') && (
                                                    <span className="w-2 h-2 rounded-full bg-accent shadow-sm" title="Recomendado"></span>
                                                )}
                                                {product.attributes.includes('vegetariano') && (
                                                    <span className="w-2 h-2 rounded-full bg-organic shadow-sm" title="Vegetariano"></span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col flex-1 justify-between py-1">
                                        <div>
                                            <h3 className="font-heading text-lg text-gray-800 leading-tight mb-1 group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                                {product.description}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
                                            <span className="font-bold text-lg text-primary">
                                                {formatPrice(product.price)}
                                            </span>
                                            {/* Add Button Placeholder - for future cart logic */}
                                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
