import { NextRequest } from 'next/server';
import { requireAuth, createErrorResponse, createSuccessResponse, AuthenticatedUser } from '@/lib/api';

export const GET = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const prisma = await import('@/lib/prisma').then(m => m.prisma);
    
    // Get full user data including settings
    const userData = await prisma.devTracker_User.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        timezone: true,
        emailNotifications: true,
        reminder12pm: true,
        reminderEod: true,
      },
    });

    if (!userData) {
      return createErrorResponse('User not found', 404);
    }

    return createSuccessResponse({
      user: userData
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return createErrorResponse('Internal server error', 500);
  }
}); 