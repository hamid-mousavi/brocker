export interface Broker {
  id: string;
  name: string;
  ports: string[];
  experience: number;
  verified: boolean;
  services: string[];
  mobile: string;
  description: string;
  whatsapp?: string;
}

export type Port = 'بندر عباس' | 'امام خمینی' | 'بوشهر';
export type ServiceType = 'واردات' | 'صادرات' | 'کالای ویژه';

export interface BrokerFilters {
  port?: Port;
  serviceType?: ServiceType;
}
