import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions, hasValidSession } from '@/lib/auth';
import { AdminPage } from '@/components/admin-page';

export default async function Admin() {
  const session = await getServerSession(authOptions);
  
  if (!hasValidSession(session)) {
    redirect('/sign-in');
  }

  // Check if user has admin role
  if (session.user.role !== 'admin') {
    redirect('/');
  }

  return <AdminPage />
}
