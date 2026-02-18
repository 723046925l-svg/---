'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'ar';

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace(`/${locale}/login`);
    }
  }, [locale, router]);

  return (
    <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>لوحة التحكم</h1>
      <p style={{ color: '#4b5563', marginBottom: 0 }}>هذه صفحة محمية وتتطلب accessToken.</p>
    </section>
  );
}
