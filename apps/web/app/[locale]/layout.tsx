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
        }}
      >
        <strong>{isAr ? 'نظام العيادة' : 'Clinic System'}</strong>
        <nav style={{ display: 'flex', gap: 16 }}>
          <Link href={`/${locale}`}>{isAr ? 'الرئيسية' : 'Home'}</Link>
          <Link href={`/${locale}/login`}>{isAr ? 'تسجيل الدخول' : 'Login'}</Link>
          <Link href={`/${locale}/dashboard`}>{isAr ? 'لوحة التحكم' : 'Dashboard'}</Link>
        </nav>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: isAr ? '1fr 250px' : '250px 1fr' }}>
        <aside
          style={{
            background: '#0f766e',
            color: 'white',
            minHeight: 'calc(100vh - 64px)',
            padding: 20,
          }}
        >
          <h3 style={{ marginTop: 0 }}>{isAr ? 'القائمة' : 'Menu'}</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
            <li>
              <Link href={`/${locale}`} style={{ color: 'white' }}>
                {isAr ? 'الرئيسية' : 'Home'}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/login`} style={{ color: 'white' }}>
                {isAr ? 'تسجيل الدخول' : 'Login'}
              </Link>
            </li>
          </ul>
        </aside>

        <main style={{ padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}
