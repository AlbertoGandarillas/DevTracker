import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {/* Main Content */}
      <main className="w-full max-w-md px-6">
        <div className="text-center space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Sign in to DevTracker
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Access restricted to authorized team members only
            </p>
          </div>
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-[#6c47ff] hover:bg-[#5a3fd8]',
                card: 'shadow-lg',
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}