// Static data loader for GitHub Pages (no Flask backend)
// Reads from /data.json which is pre-exported from the database

let cachedData: Record<string, any> | null = null;

async function loadStaticData(): Promise<Record<string, any>> {
  if (cachedData) return cachedData;
  const resp = await fetch('/data.json');
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

export async function getStaticData(path: string): Promise<any> {
  const data = await loadStaticData();
  // Handle query params (e.g., /travel-photos?country=China)
  const basePath = path.split('?')[0];
  const key = pathMap[basePath];
  if (!key) return null;
  const result = data[key];

  // Handle country filter for travel-photos
  if (basePath === '/travel-photos' && path.includes('country=')) {
    const country = new URLSearchParams(path.split('?')[1] || '').get('country');
    if (country) {
      const photos = result?.value || result || [];
      return photos.filter((p: any) => p.country === country);
    }
  }
  return result;
}
