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