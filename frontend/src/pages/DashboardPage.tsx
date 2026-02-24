import { useEffect, useState } from 'react'
import { api } from '../api/client'

export const DashboardPage = () => {
  const [data, setData] = useState<any>()
  useEffect(() => {
    api.get('/dashboard').then((res) => setData(res.data)).catch(() => setData({}))
  }, [])
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Samples: {data?.total_samples ?? '-'}</p>
      <p>Positive Samples: {data?.positive_samples ?? '-'}</p>
      <p>Pending vs Released: {data?.pending ?? '-'} / {data?.released ?? '-'}</p>
      <p>Overdue Tests: {data?.overdue_tests ?? '-'}</p>
      <p>Revenue: {data?.revenue ?? '-'}</p>
    </div>
  )
}
