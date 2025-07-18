import { requireAuth, createErrorResponse, createSuccessResponse } from '@/lib/api';

export const GET = requireAuth(async () => {
  try {
    const prisma = await import('@/lib/prisma').then(m => m.prisma);
    
    const users = await prisma.devTracker_User.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return createSuccessResponse({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return createErrorResponse('Internal server error', 500);
  }
}); 