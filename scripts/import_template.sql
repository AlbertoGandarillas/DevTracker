-- Template Import Script for Google Sheets Data
-- Modify the variables below for different developers and weeks

-- =============================================
-- CONFIGURATION VARIABLES - MODIFY THESE
-- =============================================
DECLARE @developerEmail NVARCHAR(256) = 'developer.email@example.com'
DECLARE @developerName NVARCHAR(100) = 'Developer Name'
DECLARE @weekStartDate DATE = '2022-07-11'  -- Monday of the week
DECLARE @weekEndDate DATE = '2022-07-15'    -- Friday of the week

-- =============================================
-- SCRIPT EXECUTION
-- =============================================

-- First, ensure developer user exists
IF NOT EXISTS (SELECT 1 FROM DevTracker_Users WHERE email = @developerEmail)
BEGIN
    INSERT INTO DevTracker_Users (id, email, name, role, createdAt)
    VALUES (
        NEWID(),
        @developerEmail,
        @developerName,
        'user',
        GETDATE()
    )
    PRINT 'Created new user: ' + @developerName
END
ELSE
BEGIN
    PRINT 'User already exists: ' + @developerName
END

-- Get developer's user ID
DECLARE @developerUserId UNIQUEIDENTIFIER
SELECT @developerUserId = id FROM DevTracker_Users WHERE email = @developerEmail

-- Clear existing activities for this developer for this week (optional)
DELETE FROM DevTracker_Activities 
WHERE userId = @developerUserId 
AND date BETWEEN @weekStartDate AND @weekEndDate

PRINT 'Cleared existing activities for week: ' + CONVERT(VARCHAR, @weekStartDate) + ' to ' + CONVERT(VARCHAR, @weekEndDate)

-- =============================================
-- INSERT ACTIVITIES - MODIFY THIS SECTION
-- =============================================

-- Monday Activities
INSERT INTO DevTracker_Activities (id, userId, date, meetingType, note, tickets, progress, createdAt)
VALUES 
(NEWID(), @developerUserId, DATEADD(day, 0, @weekStartDate), '12pm Update', 'Your 12pm update text here', 'TICKET-123', 'Your progress description here', GETDATE()),

(NEWID(), @developerUserId, DATEADD(day, 0, @weekStartDate), 'EOD Update', 'Your EOD update text here', 'TICKET-456', 'Your end of day progress here', GETDATE()),

-- Tuesday Activities
(NEWID(), @developerUserId, DATEADD(day, 1, @weekStartDate), '12pm Update', 'Your Tuesday 12pm update', 'TICKET-789', 'Tuesday progress description', GETDATE()),

(NEWID(), @developerUserId, DATEADD(day, 1, @weekStartDate), 'EOD Update', 'Your Tuesday EOD update', 'TICKET-101', 'Tuesday end of day progress', GETDATE()),

-- Wednesday Activities
(NEWID(), @developerUserId, DATEADD(day, 2, @weekStartDate), '12pm Update', 'Your Wednesday 12pm update', 'TICKET-202', 'Wednesday progress description', GETDATE()),

(NEWID(), @developerUserId, DATEADD(day, 2, @weekStartDate), 'EOD Update', 'Your Wednesday EOD update', 'TICKET-303', 'Wednesday end of day progress', GETDATE()),

-- Thursday Activities
(NEWID(), @developerUserId, DATEADD(day, 3, @weekStartDate), '12pm Update', 'Your Thursday 12pm update', 'TICKET-404', 'Thursday progress description', GETDATE()),

(NEWID(), @developerUserId, DATEADD(day, 3, @weekStartDate), 'EOD Update', 'Your Thursday EOD update', 'TICKET-505', 'Thursday end of day progress', GETDATE()),

-- Friday Activities
(NEWID(), @developerUserId, DATEADD(day, 4, @weekStartDate), '12pm Update', 'Your Friday 12pm update', 'TICKET-606', 'Friday progress description', GETDATE()),

(NEWID(), @developerUserId, DATEADD(day, 4, @weekStartDate), 'EOD Update', 'Your Friday EOD update', 'TICKET-707', 'Friday end of day progress', GETDATE())

-- =============================================
-- VERIFICATION QUERY
-- =============================================
PRINT 'Import completed. Verifying data...'

SELECT 
    a.id,
    u.name as Developer,
    a.date,
    a.meetingType,
    a.note,
    a.tickets,
    a.progress,
    a.createdAt
FROM DevTracker_Activities a
JOIN DevTracker_Users u ON a.userId = u.id
WHERE u.email = @developerEmail
AND a.date BETWEEN @weekStartDate AND @weekEndDate
ORDER BY a.date, a.meetingType

PRINT 'Import verification complete. Check the results above.' 