export async function generateMetadata({ params }: any) {
  return {
    title: `Doctor ${params.slug}`,
    openGraph: { title: `Doctor ${params.slug}`, url: `https://example.iq/${params.locale}/doctor/${params.slug}` },
    twitter: { card: 'summary_large_image', title: `Doctor ${params.slug}` },
  };
}
export default function Doctor() { return <div>Doctor SSR profile page</div>; }
