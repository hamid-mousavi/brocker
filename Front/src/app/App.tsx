import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { BrokersListPage } from './pages/BrokersListPage';
import { BrokerProfilePage } from './pages/BrokerProfilePage';
import { BrokerRegistrationPage } from './pages/BrokerRegistrationPage';
import { AdminReviewPage } from './pages/AdminReviewPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/brokers" element={<BrokersListPage />} />
          <Route path="/broker/:id" element={<BrokerProfilePage />} />
          <Route path="/register" element={<BrokerRegistrationPage />} />
          <Route path="/admin" element={<ErrorBoundary><AdminReviewPage /></ErrorBoundary>} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
