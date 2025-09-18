// driverfront-app/pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { login, getMe } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

export default function Login() {
  const router = useRouter();

  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const { data } = await login(creds);
    const token = data.access_token;
    localStorage.setItem('token', token);

    const payload = jwtDecode<JwtPayload>(token);

    if (payload.role === 'admin') {
      router.push('/admin-dashboard');
    } else {
      router.push('/');
    }
  } catch (err: any) {
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Login failed – please try again.';
    setError(msg);
  } finally {
    setLoading(false);
  }
};


  return (
    <main style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h1>Log In</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={submit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Logging in…' : 'Log In'}
        </button>
      </form>
    </main>
  );
}