import Link from 'next/link';
export default function LocaleLayout({ children, params }: any) {
  const locale = params.locale;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return <div dir={dir}><nav style={{display:'flex',gap:10}}><Link href={`/${locale}`}>Home</Link><Link href={`/${locale}/booking`}>Booking</Link><Link href={`/${locale}/inbox`}>Inbox</Link><Link href={`/${locale}/admin`}>Admin</Link><Link href={locale==='ar'?'/en':'/ar'}>{locale==='ar'?'EN':'AR'}</Link></nav>{children}</div>;
}
