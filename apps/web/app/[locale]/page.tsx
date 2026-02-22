import Link from 'next/link';

async function getClinics() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clinics`, { cache: 'no-store' });
  return res.json();
}
export default async function Home({ params }: any) {
  const clinics = await getClinics();
  return <main><h1>{params.locale==='ar'?'حجز العيادات':'Clinic Booking'}</h1>{clinics.map((c:any)=><div className='card' key={c.id}><h3>{c.name}</h3><p>{c.address}</p><Link href={`/${params.locale}/clinic/${c.id}`}>View clinic</Link></div>)}</main>;
}
