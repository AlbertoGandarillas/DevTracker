import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Fetch all users
    const users = await prisma.devTracker_User.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 