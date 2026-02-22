import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest { return { name: 'Clinic Demo', short_name: 'Clinic', start_url: '/ar', display: 'standalone', background_color: '#ffffff', theme_color: '#2563eb', icons: [{ src: '/icon.png', sizes: '192x192', type: 'image/png' }] }; }
