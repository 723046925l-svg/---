'use client';
import { useEffect, useState } from 'react';
export default function Inbox() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{(async()=>{
    const login = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'patient@demo.iq',password:'Password123!'})}).then(r=>r.json());
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/inbox`,{headers:{authorization:`Bearer ${login.accessToken}`}}).then(r=>r.json());
    setItems(data);
  })();},[]);
  return <div><h2>Inbox</h2>{items.map(i=><div className='card' key={i.id}>{i.titleAr} / {i.titleEn}</div>)}</div>;
}
