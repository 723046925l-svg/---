import Link from 'next/link';
export default function Home({ params }: { params: { locale: string } }) {
  return <main><h1>{params.locale === 'ar' ? 'منصة صحة العراق' : 'Iraq Health Platform'}</h1><Link href={`/${params.locale}/doctor/dr-ali`}>Doctor Profile</Link></main>;
}
