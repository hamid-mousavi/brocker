type GeocodeResult = { latitude: number; longitude: number; display_name?: string };

const forwardCache = new Map<string, GeocodeResult | null>();
const reverseCache = new Map<string, string | null>();

async function fetchWithBackoff(url: string, tries = 3, delay = 500): Promise<Response> {
  try {
    return await fetch(url, { headers: { 'Accept': 'application/json' } });
  } catch (err) {
    if (tries <= 1) throw err;
    await new Promise(r => setTimeout(r, delay));
    return fetchWithBackoff(url, tries - 1, delay * 2);
  }
}

export async function forwardGeocode(query: string): Promise<GeocodeResult | null> {
  if (!query) return null;
  if (forwardCache.has(query)) return forwardCache.get(query) as GeocodeResult | null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=1&accept-language=fa`;
    const res = await fetchWithBackoff(url);
    if (!res.ok) {
      forwardCache.set(query, null);
      return null;
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      forwardCache.set(query, null);
      return null;
    }
    const first = data[0];
    const result = { latitude: Number(first.lat), longitude: Number(first.lon), display_name: first.display_name };
    forwardCache.set(query, result);
    return result;
  } catch (err) {
    forwardCache.set(query, null);
    return null;
  }
}

export async function reverseGeocode(lat: number | string, lon: number | string): Promise<string> {
  const key = `${lat},${lon}`;
  if (reverseCache.has(key)) return reverseCache.get(key) || '';
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=fa`;
    const res = await fetchWithBackoff(url);
    if (!res.ok) {
      reverseCache.set(key, '');
      return '';
    }
    const data = await res.json();
    const display = data?.display_name || '';
    reverseCache.set(key, display);
    return display;
  } catch (err) {
    reverseCache.set(key, '');
    return '';
  }
}
