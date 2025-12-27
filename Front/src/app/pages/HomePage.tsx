import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Ship, Phone } from 'lucide-react';
import { BrokerCard } from '../components/BrokerCard';
import { useAgents } from '../hooks/useAgents';
import { Port, ServiceType } from '../types';

export function HomePage() {
  const navigate = useNavigate();
  const [port, setPort] = useState<Port | ''>('');
  const [serviceType, setServiceType] = useState<ServiceType | ''>('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (port) params.append('port', port);
    if (serviceType) params.append('service', serviceType);
    navigate(`/brokers?${params.toString()}`);
  };

  // Show first 3 brokers as preview (from backend when available)
  const { agents: previewBrokers, loading: previewLoading } = useAgents(1, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-10 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <Ship className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 px-4">
            یافتن ترخیص‌کار مطمئن در بنادر ایران
          </h1>
          <p className="text-sm md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            با بهترین ترخیص‌کاران متخصص در واردات، صادرات و ترخیص کالاهای ویژه ارتباط برقرار کنید
          </p>

          {/* Search Filters */}
          <div className="bg-white rounded-xl p-4 md:p-6 max-w-3xl mx-auto shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div>
                <label className="block text-right text-gray-700 mb-2 text-xs md:text-sm">
                  انتخاب بندر
                </label>
                <select
                  value={port}
                  onChange={(e) => setPort(e.target.value as Port)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                >
                  <option value="">همه بنادر</option>
                  <option value="بندر عباس">بندر عباس</option>
                  <option value="امام خمینی">امام خمینی</option>
                  <option value="بوشهر">بوشهر</option>
                </select>
              </div>

              <div>
                <label className="block text-right text-gray-700 mb-2 text-xs md:text-sm">
                  نوع خدمات
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as ServiceType)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                >
                  <option value="">همه خدمات</option>
                  <option value="واردات">واردات</option>
                  <option value="صادرات">صادرات</option>
                  <option value="کالای ویژه">کالای ویژه</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full bg-blue-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5" />
                  جستجو
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Brokers Section */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold">ترخیص‌کاران برتر</h2>
            <Link
              to="/brokers"
              className="text-blue-600 hover:text-blue-700 transition text-sm md:text-base"
            >
              مشاهده همه ←
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {previewLoading ? (
              <div className="col-span-full text-center py-6">در حال بارگذاری ...</div>
            ) : previewBrokers && previewBrokers.length > 0 ? (
              previewBrokers.map((broker) => (
                <BrokerCard key={broker.id} broker={broker} />
              ))
            ) : (
              <div className="col-span-full text-center py-6 text-gray-500">ترخیص‌کاری یافت نشد</div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-8 md:mb-12">چرا سامانه ترخیص‌کاران؟</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Search className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2 text-base md:text-lg">جستجوی آسان</h3>
              <p className="text-gray-600 text-sm md:text-base">
                با فیلترهای پیشرفته، ترخیص‌کار مورد نظر خود را سریع پیدا کنید
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Ship className="w-7 h-7 md:w-8 md:h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2 text-base md:text-lg">ترخیص‌کاران معتبر</h3>
              <p className="text-gray-600 text-sm md:text-base">
                همه ترخیص‌کاران پلتفرم بررسی و تایید شده‌اند
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Phone className="w-7 h-7 md:w-8 md:h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2 text-base md:text-lg">تماس مستقیم</h3>
              <p className="text-gray-600 text-sm md:text-base">
                بدون واسطه با ترخیص‌کاران تماس بگیرید
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}