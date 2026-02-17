export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const isAr = params.locale === 'ar';
  return <div dir={isAr ? 'rtl' : 'ltr'} style={{ fontFamily: isAr ? 'Tahoma' : 'Inter', padding: 20 }}>{children}</div>;
}
