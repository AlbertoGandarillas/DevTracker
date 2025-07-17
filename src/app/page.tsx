import { currentUser } from '@clerk/nextjs/server';
import { getUserByEmail } from '@/lib/auth';
import { DashboardPage } from '@/components/dashboard-page';

export default async function Home() {
  const user = await currentUser();
  
  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to DevTracker</h1>
          <p className="text-lg text-gray-600 mb-8">
            Please sign in to access your development activity dashboard.
          </p>
        </div>
      </main>
    );
  }

  const email = user.emailAddresses[0]?.emailAddress;
  const dbUser = email ? await getUserByEmail(email) : null;

  return <DashboardPage />;
}
