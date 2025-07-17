import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, createErrorResponse, createSuccessResponse, AuthenticatedUser } from '@/lib/api';

export const POST = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const body = await request.json();
    const { meetingType, activityDetails } = body;

    // Validation
    if (!meetingType || !meetingType.trim()) {
      return createErrorResponse('Meeting type is required');
    }

    if (!activityDetails || !activityDetails.trim()) {
      return createErrorResponse('Activity details are required');
    }

    // Create the activity
    const activity = await prisma.devTracker_Activity.create({
      data: {
        userId: user.dbUser.id,
        date: new Date(),
        meetingType: meetingType.trim(),
        note: activityDetails.trim(),
        progress: activityDetails.trim(),
      },
    });

    return createSuccessResponse({
      activity: {
        id: activity.id,
        meetingType: activity.meetingType,
        note: activity.note,
        date: activity.date,
        createdAt: activity.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating activity:', error);
    return createErrorResponse('Internal server error', 500);
  }
}); 

export const GET = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 7;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const all = searchParams.get('all') === 'true';
    const date = searchParams.get('date');

    // Validate parameters
    if (days < 1 || days > 365) {
      return createErrorResponse('Days parameter must be between 1 and 365');
    }
    if (limit < 1 || limit > 100) {
      return createErrorResponse('Limit parameter must be between 1 and 100');
    }

    const isAdmin = user.dbUser.role === 'admin';

    // Calculate the date range
    let startDate: Date, endDate: Date;
    if (date) {
      startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
    } else {
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
    }

    // Build query
    const where: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };
    if (!(isAdmin && all)) {
      where.userId = user.dbUser.id;
    }

    // Fetch activities
    const activities = await prisma.devTracker_Activity.findMany({
      where,
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      include: { user: true },
    });

    return createSuccessResponse({
      activities: activities.map(activity => ({
        id: activity.id,
        date: activity.date,
        meetingType: activity.meetingType,
        summary: activity.note || activity.progress || '',
        timestamp: activity.createdAt,
        userName: isAdmin && all ? activity.user?.name : undefined,
      }))
    });

  } catch (error) {
    console.error('Error fetching activities:', error);
    return createErrorResponse('Internal server error', 500);
  }
}); 