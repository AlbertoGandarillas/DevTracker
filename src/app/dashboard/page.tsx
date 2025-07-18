import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions, hasValidSession } from '@/lib/auth';
import { DashboardPage } from "@/components/dashboard-page"

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!hasValidSession(session)) {
    redirect('/sign-in');
  }

  return <DashboardPage />
} 