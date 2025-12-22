import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle } from 'lucide-react';

export function BrokerRegistrationPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    ports: [] as string[],
    services: [] as string[],
    experience: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send data to backend
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handlePortToggle = (port: string) => {
    setFormData(prev => ({
      ...prev,
      ports: prev.ports.includes(port)
        ? prev.ports.filter(p => p !== port)
        : [...prev.ports, port]
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  if (submitted) {
    return (
      <div className="py-8 md:py-16 bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-md w-full text-center">
          <CheckCircle className="w-14 h-14 md:w-16 md:h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">ثبت‌نام موفقیت‌آمیز!</h2>
          <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
            درخواست شما با موفقیت ثبت شد و در حال بررسی توسط تیم ما است.
          </p>
          <p className="text-xs md:text-sm text-gray-500">
            پس از تایید، پروفایل شما در سامانه نمایش داده خواهد شد.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <UserPlus className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold">ثبت‌نام ترخیص‌کار</h1>
          </div>

          <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
            لطفاً اطلاعات خود را با دقت وارد کنید. پس از بررسی، پروفایل شما فعال خواهد شد.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Name */}
            <div>
              <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">
                نام و نام خانوادگی *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="مثال: علی محمدی"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">
                شماره موبایل *
              </label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="09121234567"
                pattern="09[0-9]{9}"
              />
            </div>

            {/* Ports */}
            <div>
              <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">
                بنادر فعال *
              </label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {['بندر عباس', 'امام خمینی', 'بوشهر'].map((port) => (
                  <button
                    key={port}
                    type="button"
                    onClick={() => handlePortToggle(port)}
                    className={`px-3 md:px-4 py-2 rounded-lg border-2 transition text-sm md:text-base ${
                      formData.ports.includes(port)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {port}
                  </button>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">
                خدمات *
              </label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {['واردات', 'صادرات', 'کالای ویژه'].map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => handleServiceToggle(service)}
                    className={`px-3 md:px-4 py-2 rounded-lg border-2 transition text-sm md:text-base ${
                      formData.services.includes(service)
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-600'
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">
                سابقه کاری (سال) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="مثال: 10"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">
                توضیحات *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm md:text-base"
                placeholder="توضیحات کامل درباره خدمات و تخصص خود را بنویسید..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-sm md:text-base"
            >
              ثبت درخواست
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}