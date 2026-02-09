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

                <footer className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 text-center text-xs text-gray-400 z-30">
                    <p>© {new Date().getFullYear()} El Gallineral Resto-Bar</p>
                </footer>
            </div>
        </div>
    );
}
