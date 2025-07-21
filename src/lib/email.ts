import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export interface EmailUser {
  id: string;
  email: string;
  name: string;
  timezone: string;
}

export interface ReminderEmailData {
  user: EmailUser;
  type: '12pm' | 'eod';
  submissionUrl: string;
  hasSubmittedToday: boolean;
}

export async function sendReminderEmail(data: ReminderEmailData) {
  const { user, type, submissionUrl, hasSubmittedToday } = data;
  
  const subject = type === '12pm' 
    ? '🕛 Time for your 12pm update!' 
    : '🌙 Time for your EOD update!';

  const greeting = `Hi ${user.name || 'there'}!`;
  
  const message = type === '12pm'
    ? "It's time for your 12pm update. Please share your progress and any updates from this morning."
    : "It's time for your End of Day (EOD) update. Please share your final progress and any completed work.";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DevTracker Reminder</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>DevTracker Reminder</h1>
          <p>${type === '12pm' ? '🕛 12pm Update' : '🌙 EOD Update'}</p>
        </div>
        <div class="content">
          <h2>${greeting}</h2>
          <p>${message}</p>
          
          ${hasSubmittedToday ? `
            <div class="warning">
              <strong>Note:</strong> You haven't submitted your ${type === '12pm' ? '12pm' : 'EOD'} update yet today.
            </div>
          ` : ''}
          
          <p>Click the button below to submit your update:</p>
          <a href="${submissionUrl}" class="button">Submit Update</a>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${submissionUrl}</p>
          
          <p>Thanks for keeping the team updated!</p>
        </div>
        <div class="footer">
          <p>This is an automated reminder from DevTracker</p>
          <p>If you have any questions, please contact your team lead</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    DevTracker Reminder - ${type === '12pm' ? '12pm Update' : 'EOD Update'}
    
    ${greeting}
    
    ${message}
    
    ${hasSubmittedToday ? 'Note: You haven\'t submitted your update yet today.' : ''}
    
    Submit your update here: ${submissionUrl}
    
    Thanks for keeping the team updated!
    
    ---
    This is an automated reminder from DevTracker
  `;

  try {
    await sgMail.send({
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@devtracker.com',
      subject,
      text,
      html,
    });
    
    console.log(`Reminder email sent to ${user.email} for ${type} update`);
    return true;
  } catch (error) {
    console.error(`Failed to send reminder email to ${user.email}:`, error);
    return false;
  }
}

export async function sendBulkReminders(users: EmailUser[], type: '12pm' | 'eod', baseUrl: string) {
  const results = [];
  
  for (const user of users) {
    const submissionUrl = `${baseUrl}/dashboard`;
    const hasSubmittedToday = false; // This will be checked in the cron job
    
    const result = await sendReminderEmail({
      user,
      type,
      submissionUrl,
      hasSubmittedToday,
    });
    
    results.push({
      user: user.email,
      success: result,
    });
  }
  
  return results;
} 