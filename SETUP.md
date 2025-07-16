# DevTracker Authentication Setup

This guide explains how to set up Clerk authentication with database-driven user authorization for DevTracker.

## Current Configuration

The application checks the `DevTracker_Users` table in your database to determine which users are authorized to access the application. Only users that exist in this table can sign in.

## Environment Variables Required

Add these to your `.env` file:

```env
# Database
DATABASE_URL=mssql://username:password@server:1433/database?encrypt=true

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Clerk Webhook (optional, for automatic user sync)
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Database Setup

### 1. Ensure Tables Exist

Make sure your database has the following tables:
- `DevTracker_Users` - Contains authorized users
- `DevTracker_Activities` - Contains user activities

### 2. Add Authorized Users

Insert users into the `DevTracker_Users` table:

```sql
INSERT INTO [dbo].[DevTracker_Users] (Id, Email, Name, Role, CreatedAt)
VALUES 
    (NEWID(), 'pedro.campos@theinfotechpartners.com', 'Pedro Campos', 'user', SYSDATETIME()),
    (NEWID(), 'acgl2015@gmail.com', 'Admin User', 'admin', SYSDATETIME());
```

### 3. Update Prisma Schema

The schema includes table mappings to match your database:

```prisma
model DevTracker_User {
  // ... fields ...
  @@map("DevTracker_Users")
}

model DevTracker_Activity {
  // ... fields ...
  @@map("DevTracker_Activities")
}
```

## Clerk Dashboard Setup

### 1. Create a Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Choose "Next.js" as your framework

### 2. Configure Authentication

1. In your Clerk dashboard, go to **Authentication** → **Email, Phone, Username**
2. Enable **Email address** as a sign-in method
3. Optionally enable **Google OAuth** for easier sign-in

### 3. Set Up Webhook (Optional)

For automatic user synchronization:

1. Go to **Webhooks** in your Clerk dashboard
2. Create a new webhook endpoint
3. Set the endpoint URL to: `https://your-domain.com/api/webhooks/clerk`
4. Select these events:
   - `user.created`
   - `user.updated`
5. Copy the webhook secret and add it to your `.env` as `CLERK_WEBHOOK_SECRET`

**Note**: The webhook uses Node.js built-in crypto module for signature verification - no additional dependencies required.

### 4. Configure Allowed Domains

1. Go to **Authentication** → **Email, Phone, Username**
2. Under **Email address**, add these domains to allowed list:
   - `theinfotechpartners.com`
   - `gmail.com`

## How It Works

### Authentication Flow

1. **User tries to sign in** with Clerk
2. **Database check** occurs in the AuthGuard component
3. **User validation** checks if email exists in `DevTracker_Users` table
4. **Access granted** only if user exists in database

### Security Features

- ✅ **Database-driven authorization**: Only users in `DevTracker_Users` table can access
- ✅ **Role-based access**: Admin vs user roles from database
- ✅ **Automatic user sync**: Updates user info from Clerk
- ✅ **No sign-up**: Sign-up button is hidden
- ✅ **Unauthorized handling**: Clear error messages for blocked users
- ✅ **Webhook verification**: Built-in crypto module (no external dependencies)

### Files Modified

- `src/app/layout.tsx` - Removed sign-up button, added AuthGuard
- `src/components/AuthGuard.tsx` - User validation component
- `src/lib/auth.ts` - Database-driven authentication utilities
- `src/app/api/auth/validate/route.ts` - Database user validation API
- `src/app/api/webhooks/clerk/route.ts` - Database user check webhook handler
- `src/app/sign-in/[[...sign-in]]/page.tsx` - Custom sign-in page
- `prisma/schema.prisma` - Updated with table mappings

## Testing

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test with database users**:
   - Try signing in with any email that exists in `DevTracker_Users` table
   - Should see successful authentication and user info

3. **Test with unauthorized email**:
   - Try signing in with an email not in the database
   - Should see "Access Denied" message

## Dependencies

The authentication system uses only built-in Node.js modules and existing dependencies:
- ✅ No additional JavaScript dependencies required
- ✅ Uses Node.js `crypto` module for webhook verification
- ✅ Leverages existing Clerk and Prisma dependencies

## Troubleshooting

### Common Issues

1. **"Unauthorized" error**:
   - Check that the email exists in `DevTracker_Users` table
   - Verify the email domain is allowed in Clerk dashboard

2. **Database connection issues**:
   - Verify `DATABASE_URL` is correct
   - Ensure tables exist with correct names (`DevTracker_Users`, `DevTracker_Activities`)

3. **Clerk configuration issues**:
   - Verify all environment variables are set
   - Check Clerk dashboard for correct configuration

4. **Webhook issues**:
   - Webhook verification is optional - system works without it
   - Check browser console for webhook-related errors

### Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure the database is accessible and tables exist
4. Check Clerk dashboard for webhook delivery status 