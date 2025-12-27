import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Phone, MessageCircle, MapPin, Briefcase, CheckCircle, ArrowRight, Calendar } from 'lucide-react';
import { getAgentById } from '../../lib/api';
import type { Broker } from '../types';

export function BrokerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [broker, setBroker] = useState<Broker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    getAgentById(id)
      .then((res: any) => {
        if (!mounted) return;
        if (res.success && res.data) {
          const a = res.data;
          const mapped: Broker = {
            id: String(a.id),
            name: a.fullName ?? a.companyName ?? '',
            ports: a.customs ?? [],
            services: a.goodsTypes ?? [],
            experience: a.yearsOfExperience ?? 0,
            verified: a.isVerified ?? false,
            mobile: a.mobile ?? '',
            phoneNumbers: a.phoneNumbers ?? [],
            description: a.bio ?? '',
            whatsapp: a.whatsapp ?? undefined
          };
          setBroker(mapped);
          // initialize selected phone
          setSelectedPhone(mapped.phoneNumbers && mapped.phoneNumbers.length > 0 ? mapped.phoneNumbers[0] : mapped.mobile || null);
        } else {
          setError(res.message ?? 'ترخیص‌کار یافت نشد');
        }
      })
      .catch((err: any) => setError(err?.message ?? JSON.stringify(err)))
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="py-16 text-center">در حال بارگذاری ...</div>;
  if (error) return (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-700">{error}</h2>
      <Link to="/brokers" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">بازگشت به لیست</Link>
    </div>
  );
  if (!broker) return (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-700">ترخیص‌کار یافت نشد</h2>
      <Link to="/brokers" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">بازگشت به لیست</Link>
    </div>
  );

  const primaryPhone = (broker?.phoneNumbers && broker.phoneNumbers.length>0) ? broker.phoneNumbers[0] : broker?.mobile;

  return (
    <div className="py-4 md:py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/brokers" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 md:mb-6 text-sm md:text-base">
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /> بازگشت به لیست
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 md:p-8 text-white">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl md:text-3xl font-bold text-blue-600">{broker.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <h1 className="text-xl md:text-3xl font-bold truncate">{broker.name}</h1>
                  {broker.verified && (
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-blue-100 text-sm md:text-base">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                  <span>{broker.experience} سال سابقه کاری</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="border border-gray-200 rounded-lg p-3 md:p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm md:text-base">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="font-semibold">بنادر فعال</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {broker.ports.map((port, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">{port}</span>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 md:p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm md:text-base">
                  <Briefcase className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="font-semibold">خدمات</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {broker.services.map((service, index) => (
                    <span key={index} className="bg-green-100 text-green-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">{service}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">درباره</h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">{broker.description}</p>
            </div>

            <div className="mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">اطلاعات تماس</h2>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <p className="text-gray-600 mb-1 text-xs md:text-sm">شماره موبایل</p>
                <p className="text-lg md:text-xl font-semibold">{primaryPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 md:p-4 shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <a href={`tel:${primaryPhone}`} className="bg-blue-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold text-sm md:text-base">
              <Phone className="w-4 h-4 md:w-5 md:h-5" /> تماس تلفنی
            </a>
            <a href={`https://wa.me/${broker.whatsapp || primaryPhone}`} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold text-sm md:text-base">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" /> واتساپ
            </a>
          </div>
        </div>
      </div>

      <div className="h-20 md:h-24"></div>
    </div>
  );
}