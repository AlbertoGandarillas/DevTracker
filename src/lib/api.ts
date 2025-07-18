import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions, hasValidSession } from './auth';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!hasValidSession(session)) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.name,
      role: session.user.role
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

    if (user.role !== 'admin') {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    return handler(req, user);
  };
} 