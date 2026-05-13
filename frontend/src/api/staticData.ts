// Static data loader for GitHub Pages (no Flask backend)
// Reads from /data.json which is pre-exported from the database

let cachedData: Record<string, any> | null = null;

async function loadStaticData(): Promise<Record<string, any>> {
  if (cachedData) return cachedData;
  const base = import.meta.env.BASE_URL;
  const resp = await fetch(`${base}data.json`);
  cachedData = await resp.json();
  return cachedData!;
}

// Maps API paths to static data keys
const pathMap: Record<string, string> = {
  '/personal': 'personal',
  '/timeline': 'timeline',
  '/projects': 'projects',
  '/competitions': 'competitions',
  '/skills': 'skills',
  '/certifications': 'certifications',
  '/interests': 'interests',
  '/travel-photos': 'travel-photos',
  '/travel-countries': 'travel-countries',
  '/playlists': 'playlists',
  '/guestbook': 'guestbook',
  '/writings': 'writings',
  '/project-categories': 'project-categories',
};

function fixImagePaths(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(fixImagePaths);
  const base = import.meta.env.BASE_URL;
  const fixed: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key === 'image_path' && typeof val === 'string' && val.startsWith('/images/')) {
      fixed[key] = base + val.slice(1);
    } else {
      fixed[key] = fixImagePaths(val);
    }
  }
  return fixed;
}

function unwrapValue(result: any): any {
  if (result && typeof result === 'object' && !Array.isArray(result) && 'value' in result) {
    return result.value;
  }
  return result;
}

export async function getStaticData(path: string): Promise<any> {
  const data = await loadStaticData();
  const basePath = path.split('?')[0];
  const key = pathMap[basePath];
  if (!key) return null;
  let result = data[key];

  if (basePath === '/travel-photos' && path.includes('country=')) {
    const country = new URLSearchParams(path.split('?')[1] || '').get('country');
    if (country) {
      const photos = unwrapValue(result);
      const filtered = Array.isArray(photos) ? photos.filter((p: any) => p.country === country) : photos;
      return fixImagePaths(filtered);
    }
  }
  return fixImagePaths(unwrapValue(result));
}
