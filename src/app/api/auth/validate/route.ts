import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data from Clerk
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

    // Check if user exists in database
    const existingUser = await prisma.devTracker_User.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!existingUser) {
      return NextResponse.json({ 
        error: 'Access denied. This email is not authorized to use this application.',
        unauthorized: true 
      }, { status: 403 });
    }

    // Update user information if needed
    const updatedUser = await prisma.devTracker_User.update({
      where: { email: email.toLowerCase() },
      data: {
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || existingUser.name,
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Error validating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 