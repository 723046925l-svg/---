export default async function Doctor({ params }: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/${params.id}`, { cache: 'no-store' });
  const d = await res.json();
  return <div><h2>{d?.user?.name}</h2><p>{d?.specialty?.name}</p><p>{d?.bio}</p></div>;
}
