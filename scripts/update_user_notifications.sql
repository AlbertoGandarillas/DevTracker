-- DevTracker User Notification Settings Update Script
-- This script adds the new notification columns to all existing users
-- Run this script after deploying the Prisma migration

-- Step 1: Add the new columns to the DevTracker_Users table
-- (This should be done by Prisma migration, but including for reference)

-- Add timezone column (default to UTC)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'DevTracker_Users' AND COLUMN_NAME = 'timezone')
BEGIN
    ALTER TABLE DevTracker_Users ADD timezone NVARCHAR(50) DEFAULT 'UTC';
    PRINT 'Added timezone column with default value UTC';
END
ELSE
BEGIN
    PRINT 'timezone column already exists';
END

-- Add emailNotifications column (default to true)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'DevTracker_Users' AND COLUMN_NAME = 'emailNotifications')
BEGIN
    ALTER TABLE DevTracker_Users ADD emailNotifications BIT DEFAULT 1;
    PRINT 'Added emailNotifications column with default value true';
END
ELSE
BEGIN
    PRINT 'emailNotifications column already exists';
END

-- Add reminder12pm column (default to true)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'DevTracker_Users' AND COLUMN_NAME = 'reminder12pm')
BEGIN
    ALTER TABLE DevTracker_Users ADD reminder12pm BIT DEFAULT 1;
    PRINT 'Added reminder12pm column with default value true';
END
ELSE
BEGIN
    PRINT 'reminder12pm column already exists';
END

-- Add reminderEod column (default to true)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'DevTracker_Users' AND COLUMN_NAME = 'reminderEod')
BEGIN
    ALTER TABLE DevTracker_Users ADD reminderEod BIT DEFAULT 1;
    PRINT 'Added reminderEod column with default value true';
END
ELSE
BEGIN
    PRINT 'reminderEod column already exists';
END

-- Add updatedAt column (default to current timestamp)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'DevTracker_Users' AND COLUMN_NAME = 'updatedAt')
BEGIN
    ALTER TABLE DevTracker_Users ADD updatedAt DATETIME2 DEFAULT GETDATE();
    PRINT 'Added updatedAt column with default value current timestamp';
END
ELSE
BEGIN
    PRINT 'updatedAt column already exists';
END

-- Step 2: Update all existing users with default values
-- This ensures all existing users have the proper notification settings

-- Update timezone for users who don't have it set
UPDATE DevTracker_Users 
SET timezone = 'UTC' 
WHERE timezone IS NULL OR timezone = '';

-- Update emailNotifications for users who don't have it set
UPDATE DevTracker_Users 
SET emailNotifications = 1 
WHERE emailNotifications IS NULL;

-- Update reminder12pm for users who don't have it set
UPDATE DevTracker_Users 
SET reminder12pm = 1 
WHERE reminder12pm IS NULL;

-- Update reminderEod for users who don't have it set
UPDATE DevTracker_Users 
SET reminderEod = 1 
WHERE reminderEod IS NULL;

-- Update updatedAt for users who don't have it set
UPDATE DevTracker_Users 
SET updatedAt = GETDATE() 
WHERE updatedAt IS NULL;

-- Step 3: Set specific timezone for known users
-- Configure timezones based on team locations:
-- - 3 developers in Peru
-- - 1 developer in Guatemala  
-- - 1 developer in Amsterdam, Netherlands
-- - Rest in California

-- Set timezone for Peru developers (UTC-5)
-- Update these with actual email addresses
UPDATE DevTracker_Users 
SET timezone = 'America/Lima' 
WHERE email IN (
    'developer1.peru@theinfotechpartners.com',
    'developer2.peru@theinfotechpartners.com', 
    'developer3.peru@theinfotechpartners.com'
);

-- Set timezone for Guatemala developer (UTC-6)
UPDATE DevTracker_Users 
SET timezone = 'America/Guatemala' 
WHERE email = 'developer.guatemala@theinfotechpartners.com';

-- Set timezone for Amsterdam developer (UTC+1/UTC+2)
UPDATE DevTracker_Users 
SET timezone = 'Europe/Amsterdam' 
WHERE email = 'developer.amsterdam@theinfotechpartners.com';

-- Set timezone for California developers (UTC-8/UTC-7)
-- This will apply to all remaining users
UPDATE DevTracker_Users 
SET timezone = 'America/Los_Angeles' 
WHERE timezone = 'UTC' 
AND email NOT IN (
    'developer1.peru@theinfotechpartners.com',
    'developer2.peru@theinfotechpartners.com',
    'developer3.peru@theinfotechpartners.com',
    'developer.guatemala@theinfotechpartners.com',
    'developer.amsterdam@theinfotechpartners.com'
);

-- Step 4: Verify the updates
PRINT '=== VERIFICATION ===';
PRINT 'Checking updated user records:';

SELECT 
    id,
    email,
    name,
    timezone,
    emailNotifications,
    reminder12pm,
    reminderEod,
    updatedAt
FROM DevTracker_Users
ORDER BY email;

PRINT '=== SUMMARY ===';
PRINT 'Total users updated: ' + CAST((SELECT COUNT(*) FROM DevTracker_Users) AS VARCHAR(10));

-- Count users by timezone
SELECT 
    timezone,
    COUNT(*) as user_count
FROM DevTracker_Users
GROUP BY timezone
ORDER BY user_count DESC;

-- Count users with notifications enabled
SELECT 
    'Email Notifications Enabled' as setting,
    COUNT(*) as count
FROM DevTracker_Users
WHERE emailNotifications = 1
UNION ALL
SELECT 
    '12pm Reminders Enabled' as setting,
    COUNT(*) as count
FROM DevTracker_Users
WHERE reminder12pm = 1
UNION ALL
SELECT 
    'EOD Reminders Enabled' as setting,
    COUNT(*) as count
FROM DevTracker_Users
WHERE reminderEod = 1;

PRINT '=== SCRIPT COMPLETED ===';
PRINT 'All users have been updated with notification settings.';
PRINT 'The email reminder system is now ready to use.'; 