import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import FloatingNavigation from '../components/FloatingNavigation';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-surface font-body text-gray-800 antialiased bg-gray-100">
            <div className="w-full max-w-md md:max-w-5xl mx-auto bg-white min-h-screen shadow-xl overflow-hidden relative transition-all duration-300">
                <Header />

                <main className="flex-1 w-full pb-24">
                    <Outlet />
                </main>

                {/* Floating Navigation Buttons */}
                <FloatingNavigation />

                <footer className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 text-xs text-gray-400 z-30">
                    <div className="flex items-center justify-center gap-2">
                        <span>© {new Date().getFullYear()} El Gallineral Resto-Bar</span>
                        <span className="text-gray-300">|</span>
                        <img
                            src="/images/LOGO-TRIANGULAR-PASIOLO.png"
                            alt="Logo Pasíolo"
                            className="h-4 w-auto opacity-80"
                            loading="lazy"
                        />
                        <span>
                            Desarrollado por Pasíolo · Contáctanos por WhatsApp{' '}
                            <a
                                href="https://wa.me/573014308388?text=Hola%2C%20vi%20el%20desarrollo%20y%20me%20gust%C3%B3.%20Quiero%20algo%20parecido."
                                className="text-primary font-semibold hover:underline"
                                target="_blank"
                                rel="noreferrer"
                            >
                                3014308388
                            </a>
                            {' '} - Colombia
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
