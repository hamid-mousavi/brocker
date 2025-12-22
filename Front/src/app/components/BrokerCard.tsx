import { Link } from 'react-router-dom';
import { Broker } from '../types';
import { MapPin, Briefcase, CheckCircle, Phone } from 'lucide-react';

interface BrokerCardProps {
  broker: Broker;
}

export function BrokerCard({ broker }: BrokerCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex items-start gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="font-semibold text-blue-600 text-sm md:text-base">{broker.name.charAt(0)}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base md:text-lg">{broker.name}</h3>
              {broker.verified && (
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs md:text-sm text-gray-500">{broker.experience} سال سابقه</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
          <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
          <span className="line-clamp-1">{broker.ports.join('، ')}</span>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
          <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
          <span className="line-clamp-1">{broker.services.join('، ')}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          to={`/broker/${broker.id}`}
          className="flex-1 bg-blue-600 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-blue-700 transition text-center text-sm md:text-base"
        >
          مشاهده پروفایل
        </Link>
        <a
          href={`tel:${broker.mobile}`}
          className="bg-gray-100 text-gray-700 px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}