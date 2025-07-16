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

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-2">
      <div className="text-center max-w-2xl">
        <DashboardPage />
        {/* Display user information if dbUser exists */}
        {/* {dbUser && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="text-left space-y-2">
              <p><strong>Name:</strong> {dbUser.name || 'Not set'}</p>
              <p><strong>Email:</strong> {dbUser.email}</p>
              <p><strong>Role:</strong> {dbUser.role}</p>
            </div>
          </div>
        )} */}
        
      </div>
    </main>
  );
}
