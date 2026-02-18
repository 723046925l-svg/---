import Link from 'next/link';

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const isAr = params.locale === 'ar';
  const locale = params.locale;

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f7fb',
        color: '#1f2937',
        fontFamily: isAr ? 'Tahoma, Arial, sans-serif' : 'Inter, Arial, sans-serif',
      }}
    >
      <header
        style={{
          height: 64,
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <strong>{isAr ? 'نظام العيادة' : 'Clinic System'}</strong>
        <nav style={{ display: 'flex', gap: 16 }}>
          <Link href={`/${locale}`}>{isAr ? 'الرئيسية' : 'Home'}</Link>
          <Link href={`/${locale}/login`}>{isAr ? 'تسجيل الدخول' : 'Login'}</Link>
          <Link href={`/${locale}/dashboard`}>{isAr ? 'لوحة التحكم' : 'Dashboard'}</Link>
        </nav>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: isAr ? '1fr 260px' : '260px 1fr' }}>
        <aside
          style={{
            background: '#0f766e',
            color: 'white',
            minHeight: 'calc(100vh - 64px)',
            padding: 20,
            borderInlineStart: isAr ? '1px solid #115e59' : undefined,
            borderInlineEnd: !isAr ? '1px solid #115e59' : undefined,
          }}
        >
          <h3 style={{ marginTop: 0 }}>{isAr ? 'القائمة' : 'Menu'}</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
            <li>
              <Link href={`/${locale}`} style={{ color: 'white' }}>
                {isAr ? 'نظرة عامة' : 'Overview'}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/login`} style={{ color: 'white' }}>
                {isAr ? 'تسجيل الدخول' : 'Login'}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/dashboard`} style={{ color: 'white' }}>
                {isAr ? 'لوحة التحكم' : 'Dashboard'}
              </Link>
            </li>
          </ul>
        </aside>

        <main style={{ padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}
