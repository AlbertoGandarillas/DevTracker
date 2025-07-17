import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/auth';
import { HistoryPage } from '@/components/history-page';

export default async function History() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  const email = user.emailAddresses[0]?.emailAddress;
  const dbUser = email ? await getUserByEmail(email) : null;

  // Check if user exists in our database
  if (!dbUser) {
    redirect('/');
  }

  return <HistoryPage />
}
