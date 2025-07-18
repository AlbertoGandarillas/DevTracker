import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions, hasValidSession } from '@/lib/auth';
import { HistoryPage } from '@/components/history-page';

export default async function History() {
  const session = await getServerSession(authOptions);
  
  if (!hasValidSession(session)) {
    redirect('/sign-in');
  }

  return <HistoryPage />
}
