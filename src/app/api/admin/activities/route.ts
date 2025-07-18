import { NextRequest } from 'next/server';
import { requireAuth, createErrorResponse, createSuccessResponse } from '@/lib/api';

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const limit = parseInt(searchParams.get('limit') || '50');

    const prisma = await import('@/lib/prisma').then(m => m.prisma);
    
    // Get activities from the last N days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const activities = await prisma.devTracker_Activity.findMany({
      where: {
        date: {
          gte: startDate
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: limit
    });

    // Get stats
    const totalActivities = await prisma.devTracker_Activity.count();
    const activeDevelopers = await prisma.devTracker_User.count({
      where: {
        activities: {
          some: {
            date: {
              gte: startDate
            }
          }
        }
      }
    });

    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);
    const thisWeek = await prisma.devTracker_Activity.count({
      where: {
        date: {
          gte: thisWeekStart
        }
      }
    });

    const formattedActivities = activities.map((activity) => ({
      id: activity.id,
      date: activity.date,
      meetingType: activity.meetingType,
      summary: activity.note || activity.progress || '',
      timestamp: activity.createdAt,
      developer: activity.user.name,
      tickets: activity.tickets ? activity.tickets.split(',').map((t: string) => t.trim()) : [],
      submittedAt: activity.createdAt
    }));

    return createSuccessResponse({
      activities: formattedActivities,
      stats: {
        totalActivities,
        activeDevelopers,
        thisWeek
      }
    });
  } catch (error) {
    console.error('Error fetching admin activities:', error);
    return createErrorResponse('Internal server error', 500);
  }
}); 