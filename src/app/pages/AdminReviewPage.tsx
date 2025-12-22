import { useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

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
  const [brokers, setBrokers] = useState<PendingBroker[]>([
    {
      id: 'p1',
      name: 'احمد کریمی',
      mobile: '09121234569',
      ports: ['بندر عباس'],
      services: ['واردات'],
      experience: 7,
      description: 'تخصص در ترخیص کالاهای صنعتی',
      status: 'pending'
    },
    {
      id: 'p2',
      name: 'سارا رحیمی',
      mobile: '09131234568',
      ports: ['امام خمینی', 'بوشهر'],
      services: ['واردات', 'صادرات'],
      experience: 5,
      description: 'ارائه خدمات سریع و مطمئن در ترخیص کالا',
      status: 'pending'
    }
  ]);

  const handleApprove = (id: string) => {
    setBrokers(prev =>
      prev.map(broker =>
        broker.id === id ? { ...broker, status: 'approved' as const } : broker
      )
    );
  };

  const handleReject = (id: string) => {
    setBrokers(prev =>
      prev.map(broker =>
        broker.id === id ? { ...broker, status: 'rejected' as const } : broker
      )
    );
  };

  return (
    <div className="py-4 md:py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">مدیریت درخواست‌ها</h1>

        <div className="grid gap-4 md:gap-6">
          {brokers.map((broker) => (
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