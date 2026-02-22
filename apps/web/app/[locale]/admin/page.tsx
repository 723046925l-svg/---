'use client';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
const data = [{name:'Bookings',value:24},{name:'Revenue',value:1200},{name:'Cancelled',value:3},{name:'Active',value:8}];
export default function Admin(){return <div><h2>Admin Dashboard</h2><BarChart width={500} height={300} data={data}><XAxis dataKey='name'/><YAxis/><Bar dataKey='value' fill='#2563eb'/></BarChart></div>}
