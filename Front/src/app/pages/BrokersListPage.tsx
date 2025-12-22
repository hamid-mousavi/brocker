import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { BrokerCard } from '../components/BrokerCard';
import { mockBrokers } from '../data/mockBrokers';
import { Port, ServiceType, Broker } from '../types';

export function BrokersListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredBrokers, setFilteredBrokers] = useState<Broker[]>(mockBrokers);
  
  const port = searchParams.get('port') as Port | null;
  const service = searchParams.get('service') as ServiceType | null;
  
  const [selectedPort, setSelectedPort] = useState<Port | ''>(port || '');
  const [selectedService, setSelectedService] = useState<ServiceType | ''>(service || '');

  useEffect(() => {
    let filtered = mockBrokers;

    if (selectedPort) {
      filtered = filtered.filter(broker => broker.ports.includes(selectedPort));
    }

    if (selectedService) {
      filtered = filtered.filter(broker => broker.services.includes(selectedService));
    }

    setFilteredBrokers(filtered);
  }, [selectedPort, selectedService]);

  const handleFilterChange = (newPort: Port | '', newService: ServiceType | '') => {
    const params = new URLSearchParams();
    if (newPort) params.append('port', newPort);
    if (newService) params.append('service', newService);
    setSearchParams(params);
  };

  return (
    <div className="py-4 md:py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">لیست ترخیص‌کاران</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-4 md:mb-8 shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <label className="block text-right text-gray-700 mb-2 text-xs md:text-sm">
                انتخاب بندر
              </label>
              <select
                value={selectedPort}
                onChange={(e) => {
                  const val = e.target.value as Port | '';
                  setSelectedPort(val);
                  handleFilterChange(val, selectedService);
                }}
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
                value={selectedService}
                onChange={(e) => {
                  const val = e.target.value as ServiceType | '';
                  setSelectedService(val);
                  handleFilterChange(selectedPort, val);
                }}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              >
                <option value="">همه خدمات</option>
                <option value="واردات">واردات</option>
                <option value="صادرات">صادرات</option>
                <option value="کالای ویژه">کالای ویژه</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="w-full bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 rounded-lg flex items-center gap-2">
                <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-600 text-sm md:text-base">
                  {filteredBrokers.length} ترخیص‌کار
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Brokers Grid */}
        {filteredBrokers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredBrokers.map((broker) => (
              <BrokerCard key={broker.id} broker={broker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16">
            <p className="text-gray-500 text-base md:text-lg">
              ترخیص‌کاری با این مشخصات یافت نشد
            </p>
          </div>
        )}
      </div>
    </div>
  );
}