// pages/admin-dashboard.tsx
import RequireRole from '@/components/RequireRole';

export default function AdminDashboard() {
  return (
    <RequireRole allowedRoles={['admin']}>
      <h1>Admin Dashboard</h1>
      {/* admin‑only UI */}
    </RequireRole>
  );
}