export default async function Clinic({ params }: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clinics`, { cache: 'no-store' });
  const clinics = await res.json();
  const clinic = clinics.find((c:any)=>c.id===params.id);
  return <div><h2>{clinic?.name}</h2>{clinic?.doctors?.map((d:any)=><div key={d.id}><a href={`/${params.locale}/doctor/${d.id}`}>{d.user.name}</a></div>)}</div>;
}
