import { NextRequest } from 'next/server';
import { requireAuth, createErrorResponse, createSuccessResponse } from '@/lib/api';

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const limit = parseInt(searchParams.get('limit') || '50');
    const all = searchParams.get('all') === 'true';

    const prisma = await import('@/lib/prisma').then(m => m.prisma);
    
    // Build where clause
    const where: { date?: { gte: Date } } = {};
    if (!all) {
      // Get activities from the last N days
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      where.date = {
        gte: startDate
      };
    }
    
    const activities = await prisma.devTracker_Activity.findMany({
      where,
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
      ...(all ? {} : { take: limit })
    });

    // Get stats
    const totalActivities = await prisma.devTracker_Activity.count();
    
    // Calculate active developers based on recent activity
    const recentActivityStart = new Date();
    recentActivityStart.setDate(recentActivityStart.getDate() - days);
    const activeDevelopers = await prisma.devTracker_User.count({
      where: {
        activities: {
          some: {
            date: {
              gte: recentActivityStart
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