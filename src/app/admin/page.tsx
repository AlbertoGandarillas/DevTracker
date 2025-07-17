import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/auth';
import { AdminPage } from '@/components/admin-page';

export default async function Admin() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  const email = user.emailAddresses[0]?.emailAddress;
  const dbUser = email ? await getUserByEmail(email) : null;

  // Check if user exists and has admin role
  if (!dbUser || dbUser.role !== 'admin') {
    redirect('/');
  }

  return <AdminPage />
}
