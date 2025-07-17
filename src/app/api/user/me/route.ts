import { NextRequest } from 'next/server';
import { requireAuth, createErrorResponse, createSuccessResponse, AuthenticatedUser } from '@/lib/api';

export const GET = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    return createSuccessResponse({
      user: {
        id: user.dbUser.id,
        email: user.dbUser.email,
        name: user.dbUser.name,
        role: user.dbUser.role
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return createErrorResponse('Internal server error', 500);
  }
}); 