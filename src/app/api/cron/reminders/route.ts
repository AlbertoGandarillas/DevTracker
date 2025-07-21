import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReminderEmail } from '@/lib/email';

// Helper function to get current time in a specific timezone
function getCurrentTimeInTimezone(timezone: string): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
}



// Helper function to check if user has submitted today
async function hasUserSubmittedToday(userId: string, date: Date): Promise<boolean> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const activity = await prisma.devTracker_Activity.findFirst({
    where: {
      userId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });
  
  return !!activity;
}

export async function GET(request: NextRequest) {
  try {
    console.log('Cron job started: Checking for reminder emails');
    
    // Verify this is a legitimate cron request (optional security)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const baseUrl = process.env.NEXTAUTH_URL || 'https://your-app.vercel.app';
    const results = {
      sent: 0,
      skipped: 0,
      errors: 0,
      details: [] as Array<{
        user: string;
        type?: '12pm' | 'eod';
        status: string;
        timezone?: string;
        localTime?: string;
        error?: string;
      }>
    };
    
    // Get all users with email notifications enabled
    const users = await prisma.devTracker_User.findMany({
      where: {
        emailNotifications: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        timezone: true,
        reminder12pm: true,
        reminderEod: true,
      },
    });
    
    console.log(`Found ${users.length} users with email notifications enabled`);
    
    for (const user of users) {
      try {
        // Get current time in user's timezone
        const userTime = getCurrentTimeInTimezone(user.timezone);
        const userHour = userTime.getHours();
        
        // Check if user has already submitted today
        const hasSubmittedToday = await hasUserSubmittedToday(user.id, userTime);
        
        // Check for reminders - cron runs once per day at 12:00 UTC
        // Send reminders to users approaching their reminder time
        let shouldSendReminder = false;
        let reminderType: '12pm' | 'eod' | null = null;
        
        // Send 12pm reminder if user is approaching 12pm (between 11:00-12:00)
        if (userHour >= 11 && userHour < 12 && user.reminder12pm) {
          shouldSendReminder = true;
          reminderType = '12pm';
        }
        // Send 6pm reminder if user is approaching 6pm (between 17:00-18:00)
        else if (userHour >= 17 && userHour < 18 && user.reminderEod) {
          shouldSendReminder = true;
          reminderType = 'eod';
        }
        
        if (shouldSendReminder && reminderType) {
          // Only send if they haven't submitted today
          if (!hasSubmittedToday) {
            const success = await sendReminderEmail({
              user: {
                id: user.id,
                email: user.email,
                name: user.name || 'there',
                timezone: user.timezone,
              },
              type: reminderType,
              submissionUrl: `${baseUrl}/dashboard`,
              hasSubmittedToday: false,
            });
            
            if (success) {
              results.sent++;
              results.details.push({
                user: user.email,
                type: reminderType,
                status: 'sent',
                timezone: user.timezone,
                localTime: userTime.toISOString(),
              });
            } else {
              results.errors++;
              results.details.push({
                user: user.email,
                type: reminderType,
                status: 'error',
                timezone: user.timezone,
                localTime: userTime.toISOString(),
              });
            }
          } else {
            results.skipped++;
            results.details.push({
              user: user.email,
              type: reminderType,
              status: 'skipped_already_submitted',
              timezone: user.timezone,
              localTime: userTime.toISOString(),
            });
          }
        }
      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error);
        results.errors++;
        results.details.push({
          user: user.email,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    console.log(`Cron job completed: ${results.sent} sent, ${results.skipped} skipped, ${results.errors} errors`);
    
    return NextResponse.json({
      success: true,
      message: 'Reminder emails processed',
      results,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 