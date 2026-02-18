import Link from 'next/link';

export default function Home({ params }: { params: { locale: string } }) {
  const isAr = params.locale === 'ar';

  return (
    <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>{isAr ? 'مرحباً بك في نظام العيادة' : 'Welcome to Clinic System'}</h1>
      <p style={{ color: '#4b5563' }}>
        {isAr
          ? 'واجهة عربية مهيأة باتجاه RTL مع تصميم احترافي بسيط لمرحلة MVP.'
          : 'A clean professional clinic layout for MVP phase.'}
      </p>
      <Link
        href={`/${params.locale}/login`}
        style={{
          display: 'inline-block',
          marginTop: 12,
          background: '#0f766e',
          color: 'white',
          padding: '10px 16px',
          borderRadius: 8,
          textDecoration: 'none',
        }}
      >
        {isAr ? 'الانتقال إلى تسجيل الدخول' : 'Go to Login'}
      </Link>
    </section>
  );
}
