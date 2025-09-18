// driverfront-app/components/RequireRole.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

/**
 * Client‑side role guard.
 * - Reads the token from localStorage.
 * - Decodes it (no secret needed – just reads the payload).
 * - If the role is not in allowedRoles, redirects to /login.
 */
export default function RequireRole({ allowedRoles, children }: Props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const payload = jwtDecode<JwtPayload>(token);
      const hasAccess = allowedRoles.includes(payload.role);
      if (!hasAccess) {
        router.replace('/login');
      } else {
        setAuthorized(true);
      }
    } catch (e) {
      console.error('Invalid token', e);
      router.replace('/login');
    }
  }, [allowedRoles, router]);

  // While we’re checking, render nothing (or a spinner)
  if (authorized === null) return null;

  return <>{children}</>;
}