'use client';
import { useState } from 'react';
export default function Booking() {
  const [msg, setMsg] = useState('');
  const submit = async () => {
    const login = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'patient@demo.iq',password:'Password123!'})}).then(r=>r.json());
    const clinics = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clinics`).then(r=>r.json());
    const doctorId = clinics[0].doctors[0].userId;
    const appt = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`, {method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${login.accessToken}`},body:JSON.stringify({clinicId:'baghdad-clinic',doctorId,patientId:login.accessToken?JSON.parse(atob(login.accessToken.split('.')[1])).sub:'',startsAt:new Date(Date.now()+3600000).toISOString(),type:'VIDEO'})}).then(r=>r.json());
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/${appt.id}/pay`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({amount:25000})});
    const call = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/video/token/${appt.id}`,{method:'POST'}).then(r=>r.json());
    setMsg(`Booked ${appt.id} mode=${call.mode}`);
  };
  return <div><h2>Book Appointment</h2><button onClick={submit}>Book + Pay + Prepare Call</button><p>{msg}</p></div>;
}
