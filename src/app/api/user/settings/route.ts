import { NextRequest } from 'next/server';
import { requireAuth, createErrorResponse, createSuccessResponse } from '@/lib/api';

export const PUT = requireAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { timezone, emailNotifications, reminder12pm, reminderEod } = body;

    // Validate input
    if (typeof timezone !== 'string' || timezone.length === 0) {
      return createErrorResponse('Invalid timezone', 400);
    }

    if (typeof emailNotifications !== 'boolean') {
      return createErrorResponse('Invalid emailNotifications value', 400);
    }

    if (typeof reminder12pm !== 'boolean') {
      return createErrorResponse('Invalid reminder12pm value', 400);
    }

    if (typeof reminderEod !== 'boolean') {
      return createErrorResponse('Invalid reminderEod value', 400);
    }

    const prisma = await import('@/lib/prisma').then(m => m.prisma);

    // Update user settings
    const updatedUser = await prisma.devTracker_User.update({
      where: { id: user.id },
      data: {
        timezone,
        emailNotifications,
        reminder12pm,
        reminderEod,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        timezone: true,
        emailNotifications: true,
        reminder12pm: true,
        reminderEod: true,
      },
    });

    return createSuccessResponse({
      message: 'Settings updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Error updating user settings:', error);
    return createErrorResponse('Internal server error', 500);
  }
}); 