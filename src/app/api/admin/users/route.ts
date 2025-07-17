import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, createErrorResponse, createSuccessResponse, AuthenticatedUser } from '@/lib/api';

export const GET = requireAdmin(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    // Fetch all users
    const users = await prisma.devTracker_User.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return createSuccessResponse({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return createErrorResponse('Internal server error', 500);
  }
}); 