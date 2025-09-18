// driverfront-app/pages/index.tsx
import { useEffect, useState } from 'react';
import { getMe } from '@/lib/api';

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // not logged in yet

    getMe(token)
      .then(res => setProfile(res.data))
      .catch(err => setError(err.response?.data?.message || err.message));
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {profile ? (
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      ) : (
        <p>Loading your profile…</p>
      )}
    </main>
  );
}
