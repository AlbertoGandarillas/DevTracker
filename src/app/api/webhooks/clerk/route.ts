import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.log('CLERK_WEBHOOK_SECRET not configured, skipping webhook verification');
    // Continue without verification for development
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Get the body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Verify webhook signature if secret is configured
  if (WEBHOOK_SECRET && svix_signature) {
    try {
      const signature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(`${svix_id}.${svix_timestamp}.${payload}`)
        .digest('hex');
      
      const expectedSignature = svix_signature.split(',')[1];
      
      if (signature !== expectedSignature) {
        console.error('Webhook signature verification failed');
        return new Response('Invalid signature', { status: 400 });
      }
    } catch (err) {
      console.error('Error verifying webhook signature:', err);
      return new Response('Error verifying signature', { status: 400 });
    }
  }

  // Handle the webhook
  const eventType = body.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = body.data;
    
    // Get the primary email
    const primaryEmail = email_addresses?.find((email: any) => email.id === body.data.primary_email_address_id);
    
    if (!primaryEmail?.email_address) {
      return new Response('No primary email found', { status: 400 });
    }

    const email = primaryEmail.email_address.toLowerCase();

    // Check if user exists in database
    try {
      const existingUser = await prisma.devTracker_User.findUnique({
        where: { email }
      });

      if (!existingUser) {
        console.log(`Unauthorized access attempt: ${email} - User not found in database`);
        return new Response('Unauthorized email - User not found in database', { status: 403 });
      }

      // Update user information if needed
      await prisma.devTracker_User.update({
        where: { email },
        data: {
          name: `${first_name || ''} ${last_name || ''}`.trim() || existingUser.name,
        },
      });

      console.log(`User synced successfully: ${email}`);
    } catch (error) {
      console.error('Error checking/updating user:', error);
      return new Response('Error checking/updating user', { status: 500 });
    }
  }

  return new Response('Success', { status: 200 });
} 