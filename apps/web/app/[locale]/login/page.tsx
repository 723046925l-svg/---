'use client';

import { FormEvent, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'ar';

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = emailOrPhone.includes('@')
        ? { email: emailOrPhone, password }
        : { phone: emailOrPhone, password };

      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data?.accessToken) {
        throw new Error('Login failed');
      }

      localStorage.setItem('accessToken', data.accessToken);
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        maxWidth: 420,
        margin: '0 auto',
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 24,
      }}
    >
      <h1 style={{ marginTop: 0 }}>تسجيل الدخول</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          placeholder='البريد الإلكتروني أو رقم الهاتف'
          required
          style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='كلمة المرور'
          required
          style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
        />
        {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
        <button
          type='submit'
          disabled={loading}
          style={{ background: '#0f766e', color: 'white', border: 'none', borderRadius: 8, padding: '10px 12px' }}
        >
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
      </form>
    </section>
  );
}
