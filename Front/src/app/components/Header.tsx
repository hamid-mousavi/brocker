import { Link, useNavigate } from 'react-router-dom';
import { Ship, Menu } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to="/" className="flex items-center gap-2">
            <Ship className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            <span className="font-semibold text-base md:text-xl">سامانه ترخیص‌کاران</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              صفحه اصلی
            </Link>
            <Link to="/brokers" className="text-gray-700 hover:text-blue-600 transition">
              ترخیص‌کاران
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              ثبت‌نام ترخیص‌کار
            </Link>
            {localStorage.getItem('accessToken') && localStorage.getItem('role') === 'Admin' ? (
              <button
                onClick={() => { localStorage.removeItem('accessToken'); localStorage.removeItem('role'); window.location.href = '/admin/login'; }}
                className="text-gray-700 hover:text-red-600 transition text-sm"
              >خروج</button>
            ) : (
              <Link to="/admin/login" className="text-gray-500 hover:text-gray-700 transition text-sm">مدیریت</Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-blue-600 transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              صفحه اصلی
            </Link>
            <Link
              to="/brokers"
              className="block text-gray-700 hover:text-blue-600 transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              ترخیص‌کاران
            </Link>
            <Link
              to="/register"
              className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              ثبت‌نام ترخیص‌کار
            </Link>
            {localStorage.getItem('accessToken') && localStorage.getItem('role') === 'Admin' ? (
              <button
                onClick={() => { localStorage.removeItem('accessToken'); localStorage.removeItem('role'); window.location.href = '/'; }}
                className="block text-gray-700 hover:text-red-600 transition text-sm py-2"
              >خروج</button>
            ) : (
              <Link
                to="/admin/login"
                className="block text-gray-500 hover:text-gray-700 transition text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                مدیریت
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}