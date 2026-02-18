'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'ar';
  const isAr = locale === 'ar';

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace(`/${locale}/login`);
    }
  }, [locale, router]);

  return (
    <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>{isAr ? 'لوحة التحكم' : 'Dashboard'}</h1>
      <p style={{ color: '#4b5563' }}>
        {isAr
          ? 'هذه صفحة محمية. تم التحقق من وجود رمز الوصول في المتصفح.'
          : 'This is a protected page. Access token presence is validated in the browser.'}
      </p>
    </section>
  );
}
