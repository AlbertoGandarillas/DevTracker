import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 30;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;

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
    // Check if user is admin
    if (dbUser.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin privileges required.' }, { status: 403 });
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

    return NextResponse.json({ 
      success: true, 
      activities: formattedActivities,
      stats: {
        totalActivities,
        activeDevelopers,
        thisWeek,
      }
    });

  } catch (error) {
    console.error('Error fetching admin activities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 