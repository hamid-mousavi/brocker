import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { getRegistrations, approveRegistration, rejectRegistration } from '../../lib/api';

interface PendingBroker {
  id: string;
  name: string;
  mobile: string;
  ports: string[];
  services: string[];
  experience: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function AdminReviewPage() {
  const [brokers, setBrokers] = useState<PendingBroker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRegistrations(1, 50);
      if (res.success) {
        setBrokers((res.data || []).map((r: any) => ({
          id: r.id,
          name: r.fullName || r.companyName || '—',
          mobile: r.mobile || '',
          ports: r.customs || [],
          services: r.goodsTypes || [],
          experience: r.yearsOfExperience || 0,
          description: r.description || '',
          status: (r.status as 'pending' | 'approved' | 'rejected') || 'pending'
        })));
      } else {
        setError(res.message || 'خطا در دریافت درخواست‌ها');
      }
    } catch (err: any) {
      setError(err?.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveRegistration(id);
      setBrokers(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b));
    } catch (err: any) {
      setError(err?.message || JSON.stringify(err));
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRegistration(id);
      setBrokers(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b));
    } catch (err: any) {
      setError(err?.message || JSON.stringify(err));
    }
  };

  // guard + load
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    if (!token || role !== 'Admin') {
      navigate('/admin/login');
      return;
    }
    load();
  }, [navigate]);

  if (loading) return (
    <div className="py-12 text-center">در حال بارگذاری درخواست‌ها ...</div>
  );

  if (error) return (
    <div className="py-12 text-center text-red-600">خطا: {error}</div>
  );

  return (
    <div className="py-4 md:py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">مدیریت درخواست‌ها</h1>

        <div className="grid gap-4 md:gap-6">
          {brokers.length === 0 ? (
            <div className="text-center py-12">درخواستی یافت نشد</div>
          ) : brokers.map((broker) => (
            <div
              key={broker.id}
              className="bg-white rounded-xl shadow p-4 md:p-6 border-r-4 border-blue-500"
            >
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-1">{broker.name}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{broker.mobile}</p>
                </div>
                
                {broker.status === 'pending' && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">در انتظار بررسی</span>
                    <span className="sm:hidden">در انتظار</span>
                  </span>
                )}
                {broker.status === 'approved' && (
                  <span className="bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    تایید شده
                  </span>
                )}
                {broker.status === 'rejected' && (
                  <span className="bg-red-100 text-red-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    رد شده
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">بنادر فعال</p>
                  <div className="flex flex-wrap gap-2">
                    {broker.ports.map((port, index) => (
                      <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs md:text-sm">
                        {port}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">خدمات</p>
                  <div className="flex flex-wrap gap-2">
                    {broker.services.map((service, index) => (
                      <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs md:text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-3 md:mb-4">
                <p className="text-xs md:text-sm text-gray-600 mb-1">سابقه کاری</p>
                <p className="font-semibold text-sm md:text-base">{broker.experience} سال</p>
              </div>

              <div className="mb-3 md:mb-4">
                <p className="text-xs md:text-sm text-gray-600 mb-1">توضیحات</p>
                <p className="text-gray-700 text-sm md:text-base">{broker.description}</p>
              </div>

              {broker.status === 'pending' && (
                <div className="flex gap-2 md:gap-3">
                  <button
                    onClick={() => handleApprove(broker.id)}
                    className="flex-1 bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                    تایید
                  </button>
                  <button
                    onClick={() => handleReject(broker.id)}
                    className="flex-1 bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                    رد
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}