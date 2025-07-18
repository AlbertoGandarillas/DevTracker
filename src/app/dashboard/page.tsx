import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/auth';
import { DashboardPage } from "@/components/dashboard-page"

export default async function Dashboard() {
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

  return <DashboardPage />
} 