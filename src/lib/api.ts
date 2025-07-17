import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';
import { User } from '@/types';

export interface AuthenticatedUser {
  clerkUserId: string;
  email: string;
  dbUser: User;
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    // Get user data from Clerk
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const userData = await response.json();
    const email = userData.email_addresses?.[0]?.email_address;

    if (!email) {
      return null;
    }

    // Find the user in our database
    const dbUser = await prisma.devTracker_User.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!dbUser) {
      return null;
    }

    return {
      clerkUserId: userId,
      email: email.toLowerCase(),
      dbUser: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role as 'admin' | 'user'
      }
    };
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function createSuccessResponse<T>(data: T) {
  return NextResponse.json({ success: true, ...data });
}

export function requireAuth(handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    return handler(req, user);
  };
}

export function requireAdmin(handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    if (user.dbUser.role !== 'admin') {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    return handler(req, user);
  };
} 