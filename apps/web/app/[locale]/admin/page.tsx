'use client';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
const data = [{ name: 'Bookings', value: 10 }, { name: 'Revenue', value: 700000 }, { name: 'Cancel', value: 1 }];
export default function Admin() { return <div><h2>Admin analytics</h2><BarChart width={400} height={250} data={data}><XAxis dataKey='name' /><YAxis /><Bar dataKey='value' /></BarChart></div>; }
