import { Broker } from '../types';

export const mockBrokers: Broker[] = [
  {
    id: '1',
    name: 'علی محمدی',
    ports: ['بندر عباس', 'امام خمینی'],
    experience: 12,
    verified: true,
    services: ['واردات', 'صادرات', 'کالای ویژه'],
    mobile: '09121234567',
    whatsapp: '09121234567',
    description: 'با بیش از ۱۲ سال تجربه در ترخیص کالا از بنادر مختلف کشور، آماده ارائه خدمات تخصصی در زمینه واردات و صادرات کالاهای عمومی و ویژه هستم.'
  },
  {
    id: '2',
    name: 'زهرا احمدی',
    ports: ['بندر عباس'],
    experience: 8,
    verified: true,
    services: ['واردات', 'کالای ویژه'],
    mobile: '09131234567',
    whatsapp: '09131234567',
    description: 'تخصص در ترخیص کالاهای صنعتی و ماشین‌آلات. با سابقه همکاری با شرکت‌های بزرگ صنعتی.'
  },
  {
    id: '3',
    name: 'محمد رضایی',
    ports: ['امام خمینی', 'بوشهر'],
    experience: 15,
    verified: true,
    services: ['واردات', 'صادرات'],
    mobile: '09151234567',
    description: 'متخصص در ترخیص کالاهای خوراکی و بهداشتی. دارای مجوزهای لازم از سازمان‌های ذی‌ربط.'
  },
  {
    id: '4',
    name: 'فاطمه کریمی',
    ports: ['بندر عباس'],
    experience: 6,
    verified: false,
    services: ['واردات'],
    mobile: '09121234568',
    description: 'ارائه خدمات ترخیص کالاهای عمومی با قیمت مناسب و سرعت بالا.'
  },
  {
    id: '5',
    name: 'حسن موسوی',
    ports: ['امام خمینی'],
    experience: 10,
    verified: true,
    services: ['واردات', 'صادرات', 'کالای ویژه'],
    mobile: '09361234567',
    whatsapp: '09361234567',
    description: 'ترخیص کالاهای دارویی و آرایشی با تجربه در امور گمرکی و بازرگانی.'
  },
  {
    id: '6',
    name: 'مریم نوری',
    ports: ['بوشهر'],
    experience: 9,
    verified: true,
    services: ['صادرات'],
    mobile: '09171234567',
    description: 'تسهیل‌گر صادرات محصولات کشاورزی و مواد غذایی به کشورهای همسایه.'
  }
];
