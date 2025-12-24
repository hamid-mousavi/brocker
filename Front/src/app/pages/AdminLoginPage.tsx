import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../../lib/api';

export function AdminLoginPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone) return setError('شماره موبایل لازم است');
    setLoading(true);
    try {
      const res = await apiLogin(phone);
      if (res.success && res.data) {
        const token = (res.data as any).accessToken as string;
        const role = (res.data as any).role as string;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('role', role);
        navigate('/admin');
      } else {
        setError(res.message || 'خطا در ورود');
      }
    } catch (err: any) {
      setError(err?.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen" dir="rtl">
      <div className="container mx-auto px-4 max-w-md">
        <h1 className="text-2xl font-bold mb-4">ورود مدیریت</h1>
        <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow">
          <label className="block text-sm text-gray-700 mb-2">شماره موبایل</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
            placeholder="مثال: +989120000001"
          />

          {error && <div className="text-red-600 mb-3">{error}</div>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-200 px-3 py-2 rounded"
            >لغو</button>
          </div>
        </form>
      </div>
    </div>
  );
}
