import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, createErrorResponse, createSuccessResponse, AuthenticatedUser } from '@/lib/api';

export const GET = requireAdmin(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 30;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;

    // Validate parameters
    if (days < 1 || days > 365) {
      return createErrorResponse('Days parameter must be between 1 and 365');
    }
    if (limit < 1 || limit > 100) {
      return createErrorResponse('Limit parameter must be between 1 and 100');
    }

    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch all activities with user information
    const activities = await prisma.devTracker_Activity.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
      },
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    // Format activities for admin table
    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      developer: activity.user?.name || 'Unknown',
      date: activity.date,
      meetingType: activity.meetingType || 'Unknown',
      summary: activity.note || activity.progress || '',
      tickets: activity.tickets ? activity.tickets.split(',').map(t => t.trim()) : [],
      submittedAt: activity.createdAt,
    }));

    // Stats
    const totalActivities = formattedActivities.length;
    const activeDevelopers = new Set(formattedActivities.map(a => a.developer)).size;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = formattedActivities.filter(a => new Date(a.date) >= weekAgo).length;

    return createSuccessResponse({
      activities: formattedActivities,
      stats: {
        totalActivities,
        activeDevelopers,
        thisWeek,
      }
    });

  } catch (error) {
    console.error('Error fetching admin activities:', error);
    return createErrorResponse('Internal server error', 500);
  }
}); 