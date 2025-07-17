import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { meetingType, activityDetails } = body;

    // Validation
    if (!meetingType || !meetingType.trim()) {
      return NextResponse.json({ 
        error: 'Meeting type is required',
        field: 'meetingType'
      }, { status: 400 });
    }

    if (!activityDetails || !activityDetails.trim()) {
      return NextResponse.json({ 
        error: 'Activity details are required',
        field: 'activityDetails'
      }, { status: 400 });
    }

    // Get user data from Clerk to find the database user
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    const userData = await response.json();
    const email = userData.email_addresses?.[0]?.email_address;

    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    // Find the user in our database
    const dbUser = await prisma.devTracker_User.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Create the activity
    const activity = await prisma.devTracker_Activity.create({
      data: {
        userId: dbUser.id,
        date: new Date(),
        meetingType: meetingType.trim(),
        note: activityDetails.trim(),
        progress: activityDetails.trim(), // Store in progress field as well for consistency
      },
    });

    return NextResponse.json({ 
      success: true, 
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 7;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    // Validate parameters
    if (days < 1 || days > 365) {
      return NextResponse.json({ error: 'Days parameter must be between 1 and 365' }, { status: 400 });
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json({ error: 'Limit parameter must be between 1 and 100' }, { status: 400 });
    }

    // Get user data from Clerk to find the database user
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    const userData = await response.json();
    const email = userData.email_addresses?.[0]?.email_address;

    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    // Find the user in our database
    const dbUser = await prisma.devTracker_User.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch activities for the user within the date range
    const activities = await prisma.devTracker_Activity.findMany({
      where: {
        userId: dbUser.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        date: true,
        meetingType: true,
        note: true,
        progress: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      activities: activities.map(activity => ({
        id: activity.id,
        date: activity.date,
        meetingType: activity.meetingType,
        summary: activity.note || activity.progress || '',
        timestamp: activity.createdAt,
      }))
    });

  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 