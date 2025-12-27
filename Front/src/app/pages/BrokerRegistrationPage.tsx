import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle, Trash2, Plus } from 'lucide-react';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { forwardGeocode, reverseGeocode } from '../../lib/geocode';

// Fix leaflet's default icon path issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker() {
  const map = useMapEvents({
    click(e: any) {
      const { lat, lng } = e.latlng;
      // set form data by dispatching a custom event
      const ev = new CustomEvent('location-selected', { detail: { latitude: lat, longitude: lng } });
      window.dispatchEvent(ev as any);
    }
  });
  return null;
}

export function BrokerRegistrationPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(()=>{
    async function handler(e:any){
      const { latitude, longitude } = e.detail || {};
      if (latitude !== undefined && longitude !== undefined) {
        setFormData(prev => ({ ...prev, latitude: String(latitude), longitude: String(longitude) }));
        // try reverse geocoding to fill address
        try {
          setGeoLoading(true);
          const addr = await reverseGeocode(latitude, longitude);
          if (addr) setFormData(prev => ({ ...prev, address: addr }));
        } finally { setGeoLoading(false); }
        // pan map if created
        if (mapInstance) {
          try { mapInstance.setView([Number(latitude), Number(longitude)], 13); } catch {}
        }
      }
    }
    window.addEventListener('location-selected', handler as any);
    return ()=> window.removeEventListener('location-selected', handler as any);
  }, [mapInstance]);

  type PhoneEntry = { id: string; type: 'mobile' | 'office' | 'home' | 'fax' | 'other'; number: string };

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    legalType: 'individual', // 'individual' | 'company'
    mobile: '',
    officePhone: '',
    homePhone: '',
    phones: [{ id: crypto.randomUUID(), type: 'mobile' as const, number: '' }] as PhoneEntry[],
    address: '',
    latitude: '',
    longitude: '',
    ports: [] as string[],
    services: [] as string[],
    experience: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('FullName', formData.name);
      fd.append('CompanyName', formData.companyName);
      fd.append('LegalType', formData.legalType === 'company' ? '1' : '0');

      // map phone entries into backend fields
      const mobilePhone = formData.phones.find(p => p.type === 'mobile')?.number || formData.phones[0]?.number || '';
      const officePhone = formData.phones.find(p => p.type === 'office')?.number || '';
      const homePhone = formData.phones.find(p => p.type === 'home')?.number || '';

      if (mobilePhone) fd.append('Mobile', mobilePhone);
      if (officePhone) fd.append('OfficePhone', officePhone);
      if (homePhone) fd.append('HomePhone', homePhone);

      // include full phones list as JSON for server-side persistence
      try { fd.append('PhonesJson', JSON.stringify(formData.phones)); } catch {}

      if (formData.address) fd.append('Address', formData.address);
      if (formData.latitude) fd.append('Latitude', formData.latitude);
      if (formData.longitude) fd.append('Longitude', formData.longitude);

      fd.append('YearsOfExperience', formData.experience);
      fd.append('Description', formData.description);
      formData.ports.forEach(p => fd.append('Customs', p));
      formData.services.forEach(s => fd.append('GoodsTypes', s));

      files.forEach(f => fd.append('Attachments', f));

      const url = '/api/agents/register';
      const res = await fetch(url, { method: 'POST', body: fd });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.success) {
        setError(payload?.message || 'خطا در ارسال فرم');
      } else {
        setSubmitted(true);
      }
    } catch (err:any) {
      setError(err?.message ?? JSON.stringify(err));
    } finally {
      setLoading(false);
    }
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

            {/* Company Name */}
            <div>
              <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">
                نام شرکت (در صورت حقوقی)
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="مثال: شرکت ترخیص نمونه"
              />
            </div>

            {/* Legal Type */}
            <div>
              <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">نوع شخصیت حقوقی</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2"><input type="radio" name="legal" checked={formData.legalType==='individual'} onChange={()=>setFormData(prev=>({...prev, legalType:'individual'}))}/> حقیقی</label>
                <label className="flex items-center gap-2"><input type="radio" name="legal" checked={formData.legalType==='company'} onChange={()=>setFormData(prev=>({...prev, legalType:'company'}))}/> حقوقی</label>
              </div>
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

            {/* Phone numbers (dynamic) */}
            <div>
              <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">شماره‌های تماس</label>
              <div className="space-y-2">
                {formData.phones.map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <select value={p.type} onChange={(e)=>setFormData(prev=>({ ...prev, phones: prev.phones.map(ph => ph.id === p.id ? { ...ph, type: e.target.value as any } : ph) }))} className="px-2 py-2 rounded border">
                      <option value="mobile">موبایل</option>
                      <option value="office">دفتر</option>
                      <option value="home">منزل</option>
                      <option value="fax">فکس</option>
                      <option value="other">سایر</option>
                    </select>
                    <input type="tel" value={p.number} onChange={(e)=>setFormData(prev=>({ ...prev, phones: prev.phones.map(ph => ph.id === p.id ? { ...ph, number: e.target.value } : ph) }))} placeholder="مثال: +989121234567" className="flex-1 px-3 py-2 rounded border" />
                    <button type="button" onClick={()=>setFormData(prev=>({ ...prev, phones: prev.phones.filter(ph=>ph.id !== p.id) }))} className="p-2 rounded bg-red-100 text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button type="button" onClick={()=>setFormData(prev=>({ ...prev, phones: [...prev.phones, { id: crypto.randomUUID(), type: 'other', number: '' }] }))} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-gray-100 text-gray-700">
                  <Plus className="w-4 h-4" /> افزودن شماره تلفن
                </button>
              </div>
            </div>

            {/* Ports */}
            <div>
              <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">
                بنادر فعال *
              </label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {['گمرک غرب', 'گمرک جنوب', 'گمرک اصفهان'].map((port) => (
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
                {['الکترونیک', 'لباس', 'قطعات خودرو'].map((service) => (
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

            {/* Address + Map */}
            <div>
              <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">آدرس</label>
              <div className="flex gap-2 mb-3">
                <input type="text" value={formData.address} onChange={(e)=>setFormData(prev=>({...prev,address:e.target.value}))} className="flex-1 px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base" placeholder="آدرس کامل" />
                <button type="button" onClick={async ()=>{
                  if (!formData.address) return;
                  try { setGeoLoading(true); const res = await forwardGeocode(formData.address);
                    if (res) {
                      setFormData(prev=>({ ...prev, latitude: String(res.latitude), longitude: String(res.longitude), address: res.display_name || prev.address }));
                      if (mapInstance) try { mapInstance.setView([res.latitude, res.longitude], 13); } catch {}
                    } else {
                      setError('آدرس پیدا نشد');
                      setTimeout(()=>setError(null), 3000);
                    }
                  } finally { setGeoLoading(false); }
                }} className="px-3 py-2 rounded bg-gray-100 text-gray-700 text-sm">پیدا کردن روی نقشه</button>
              </div>

              <div className="mb-2 flex items-center gap-2">
                <button type="button" onClick={async ()=>{
                  if (!navigator.geolocation) return; 
                  navigator.geolocation.getCurrentPosition(async pos => {
                    const { latitude, longitude } = pos.coords;
                    setFormData(prev => ({ ...prev, latitude: String(latitude), longitude: String(longitude) }));
                    const addr = await reverseGeocode(latitude, longitude);
                    if (addr) setFormData(prev=>({ ...prev, address: addr }));
                    if (mapInstance) try { mapInstance.setView([latitude, longitude], 13); } catch {}
                  });
                }} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">استفاده از موقعیت فعلی</button>
                <div className="text-xs text-gray-500">برای انتخاب دقیق، روی نقشه کلیک کنید</div>
                {geoLoading && <div className="text-xs text-gray-500">در حال یافتن آدرس...</div>}
              </div>

              <div className="h-64 rounded overflow-hidden mb-3">
                <MapContainer whenCreated={(m: any)=>setMapInstance(m)} center={[35.6892,51.3890]} zoom={6} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                  {formData.latitude && formData.longitude && (
                    <Marker position={[Number(formData.latitude), Number(formData.longitude)]} />
                  )}
                </MapContainer>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">عرض جغرافیایی (اختیاری)</label>
                  <input type="text" value={formData.latitude} onChange={(e)=>setFormData(prev=>({...prev,latitude:e.target.value}))} className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base" placeholder="مثال: 35.6892" />
                </div>
                <div>
                  <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">طول جغرافیایی (اختیاری)</label>
                  <input type="text" value={formData.longitude} onChange={(e)=>setFormData(prev=>({...prev,longitude:e.target.value}))} className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base" placeholder="مثال: 51.3890" />
                </div>
              </div>
            </div>

            {/* Attachments (dropzone) */}
            <div>
              <label className="block text-right text-gray-700 mb-2 text-sm md:text-base">آپلود مدارک و تصاویر</label>

              <div
                onDragOver={(e)=>e.preventDefault()}
                onDrop={(e)=>{ e.preventDefault(); const dropped = Array.from(e.dataTransfer?.files||[]); setFiles(prev=>[...prev, ...dropped]); }}
                className="border-2 border-dashed rounded-lg p-4 text-center bg-white cursor-pointer"
                onClick={()=>{ document.getElementById('file-input')?.click(); }}
              >
                <div className="text-gray-500">فایل‌ها را اینجا بکشید یا کلیک کنید</div>
                <div className="text-xs text-gray-400 mt-1">(jpg, png, pdf) حداکثر 5 فایل</div>
                <input id="file-input" type="file" multiple className="hidden" onChange={(e)=>setFiles(prev=>[...prev, ...Array.from(e.target.files||[])])} />
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded">
                    {f.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(f)} alt={f.name} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded text-xs">{f.name.split('.').pop()}</div>
                    )}
                    <div className="flex-1 text-sm">
                      <div className="font-medium">{f.name}</div>
                      <div className="text-xs text-gray-500">{Math.round(f.size/1024)} KB</div>
                    </div>
                    <button type="button" onClick={()=>setFiles(prev=>prev.filter((_,i)=>i!==idx))} className="p-2 rounded bg-red-100 text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

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

            {/* Error / Loading */}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex gap-3 items-center">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-blue-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-sm md:text-base ${loading?"opacity-60":""}`}
              >
                {loading? 'در حال ارسال...' : 'ثبت درخواست'}
              </button>
              <button type="button" onClick={()=>{setFiles([]); setFormData({name:'',companyName:'',legalType:'individual',mobile:'',officePhone:'',homePhone:'',phones:[{ id: crypto.randomUUID(), type: 'mobile', number: '' }],address:'',latitude:'',longitude:'',ports:[],services:[],experience:'',description:''})}} className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg">پاک کردن</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}