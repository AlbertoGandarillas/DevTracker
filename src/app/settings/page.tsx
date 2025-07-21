import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions, hasValidSession } from '@/lib/auth';
import { UserSettings } from '@/components/UserSettings';

export default async function Settings() {
  const session = await getServerSession(authOptions);
  
  if (!hasValidSession(session)) {
    redirect('/sign-in');
  }

  return <UserSettings />
} 