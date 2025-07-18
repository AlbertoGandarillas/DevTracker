import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, createErrorResponse, createSuccessResponse, AuthenticatedUser } from '@/lib/api';
import { API_CONFIG } from '@/lib/constants';

export const POST = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const body = await request.json();
    const { meetingType, activityDetails, date, createdAt } = body;

    // Validation
    if (!meetingType || !meetingType.trim()) {
      return createErrorResponse('Meeting type is required');
    }

    if (!activityDetails || !activityDetails.trim()) {
      return createErrorResponse('Activity details are required');
    }

    // Use provided date or fallback to current date
    let activityDate: Date;
    if (date) {
      const providedDate = new Date(date);
      // Validate the date
      if (isNaN(providedDate.getTime())) {
        return createErrorResponse('Invalid date provided');
      }
      // Create date-only object (no time component)
      activityDate = new Date(providedDate.getFullYear(), providedDate.getMonth(), providedDate.getDate());
    } else {
      // Create date-only object for current date (no time component)
      const now = new Date();
      activityDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    // Use provided createdAt timestamp or fallback to current time
    let activityCreatedAt: Date;
    if (createdAt) {
      activityCreatedAt = new Date(createdAt);
      // Validate the timestamp
      if (isNaN(activityCreatedAt.getTime())) {
        return createErrorResponse('Invalid timestamp provided');
      }
    } else {
      activityCreatedAt = new Date();
    }

    // Create the activity
    const activity = await prisma.devTracker_Activity.create({
      data: {
        userId: user.id,
        date: activityDate,
        meetingType: meetingType.trim(),
        note: activityDetails.trim(),
        progress: activityDetails.trim(),
        createdAt: activityCreatedAt,
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
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : API_CONFIG.DEFAULT_DAYS;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : API_CONFIG.DEFAULT_LIMIT;
    const all = searchParams.get('all') === 'true';
    const date = searchParams.get('date');

    // Validate parameters
    if (days < API_CONFIG.MIN_DAYS || days > API_CONFIG.MAX_DAYS) {
      return createErrorResponse(`Days parameter must be between ${API_CONFIG.MIN_DAYS} and ${API_CONFIG.MAX_DAYS}`);
    }
    if (limit < API_CONFIG.MIN_LIMIT || limit > API_CONFIG.MAX_LIMIT) {
      return createErrorResponse(`Limit parameter must be between ${API_CONFIG.MIN_LIMIT} and ${API_CONFIG.MAX_LIMIT}`);
    }

    const isAdmin = user.role === 'admin';

    // Calculate the date range
    let startDate: Date | undefined, endDate: Date | undefined;
    if (date) {
      // Parse the date string (expected format: yyyy-MM-dd)
      const [year, month, day] = date.split('-').map(Number);
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return createErrorResponse('Invalid date parameter format. Expected yyyy-MM-dd');
      }
      
      // For specific date queries, we don't need startDate/endDate
      // We'll use exact date matching instead
    } else {
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
    }

    // Build query
    const where: Record<string, unknown> = {};
    if (date) {
      // For specific date queries, use exact date match since the field is @db.Date
      const [year, month, day] = date.split('-').map(Number);
      // Create date in UTC to match database storage
      const targetDate = new Date(Date.UTC(year, month - 1, day));
      where.date = targetDate;
    } else {
      // For date range queries, use gte/lte
      if (startDate && endDate) {
        where.date = {
          gte: startDate,
          lte: endDate,
        };
      }
    }
    if (!(isAdmin && all)) {
      where.userId = user.id;
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

export const PUT = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const body = await request.json();
    const { id, meetingType, activityDetails } = body;

    // Validation
    if (!id) {
      return createErrorResponse('Activity ID is required');
    }

    if (!meetingType || !meetingType.trim()) {
      return createErrorResponse('Meeting type is required');
    }

    if (!activityDetails || !activityDetails.trim()) {
      return createErrorResponse('Activity details are required');
    }

    const prisma = await import('@/lib/prisma').then(m => m.prisma);

    // Check if activity exists and belongs to the user (or user is admin)
    const existingActivity = await prisma.devTracker_Activity.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingActivity) {
      return createErrorResponse('Activity not found', 404);
    }

    // Only allow users to edit their own activities, or admins to edit any
    if (existingActivity.userId !== user.id && user.role !== 'admin') {
      return createErrorResponse('Access denied', 403);
    }

    // Update the activity
    const updatedActivity = await prisma.devTracker_Activity.update({
      where: { id },
      data: {
        meetingType: meetingType.trim(),
        note: activityDetails.trim(),
        progress: activityDetails.trim(),
      },
    });

    return createSuccessResponse({
      activity: {
        id: updatedActivity.id,
        meetingType: updatedActivity.meetingType,
        note: updatedActivity.note,
        date: updatedActivity.date,
        createdAt: updatedActivity.createdAt
      }
    });

  } catch (error) {
    console.error('Error updating activity:', error);
    return createErrorResponse('Internal server error', 500);
  }
});

export const DELETE = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return createErrorResponse('Activity ID is required');
    }

    const prisma = await import('@/lib/prisma').then(m => m.prisma);

    // Check if activity exists and belongs to the user (or user is admin)
    const existingActivity = await prisma.devTracker_Activity.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingActivity) {
      return createErrorResponse('Activity not found', 404);
    }

    // Only allow users to delete their own activities, or admins to delete any
    if (existingActivity.userId !== user.id && user.role !== 'admin') {
      return createErrorResponse('Access denied', 403);
    }

    // Delete the activity
    await prisma.devTracker_Activity.delete({
      where: { id }
    });

    return createSuccessResponse({
      message: 'Activity deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting activity:', error);
    return createErrorResponse('Internal server error', 500);
  }
}); 