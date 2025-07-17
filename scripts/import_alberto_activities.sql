-- Import Script for Alberto Gandarillas Activities
-- Based on Google Sheets data for Week of July 11/14 (2022)
-- This script creates the user and imports all activities

-- First, ensure Alberto Gandarillas user exists
IF NOT EXISTS (SELECT 1 FROM DevTracker_Users WHERE email = 'alberto.gandarillas@gmail.com')
BEGIN
    INSERT INTO DevTracker_Users (id, email, name, role, createdAt)
    VALUES (
        NEWID(),
        'alberto.gandarillas@gmail.com',
        'Alberto Gandarillas',
        'user',
        GETDATE()
    )
END

-- Get Alberto's user ID
DECLARE @albertoUserId UNIQUEIDENTIFIER
SELECT @albertoUserId = id FROM DevTracker_Users WHERE email = 'alberto.gandarillas@gmail.com'

-- Clear existing activities for Alberto for this week (optional - remove if you want to keep duplicates)
DELETE FROM DevTracker_Activities 
WHERE userId = @albertoUserId 
AND date BETWEEN '2022-07-11' AND '2022-07-15'

-- Insert Activities for Alberto Gandarillas
-- Monday, July 11, 2022
INSERT INTO DevTracker_Activities (id, userId, date, meetingType, note, tickets, progress, createdAt)
VALUES 
(NEWID(), @albertoUserId, '2022-07-11', '12pm Update', 'Remove About text header from CPL Landing pages. Public Upload Counts in Total Applied Credits working on stored procedure to calculate applied credits.', '1873', NULL, '2022-07-11 12:00:00'),

(NEWID(), @albertoUserId, '2022-07-11', 'EOD Update', 'Meet with Pedro C. review Trasnscribed credits. Transcribed credits added to new dashboard in QA.', '1840', NULL, '2022-07-11 12:00:00'),

-- Tuesday, July 12, 2022
(NEWID(), @albertoUserId, '2022-07-12', '12pm Update', 'Dashboard updates - Add filters into filter container, Add Learning mode filter container, Move selected filters outside filters container, Change Units to Applied Units, Indent student type and CPL Type filter, Rename CPL Type filter option, Move Learning outcomes filter underneath Student Type, Move Learning Outcomes filter to the Sidebar and make it global, Fix issues wrapping text for selected options on dropdowns. Dashboard updates completed.', '1840', NULL, '2022-07-12 12:00:00'),

(NEWID(), @albertoUserId, '2022-07-12', 'EOD Update', 'Meet with Pedro to review PopulateAggregateVeteranCredits stored procedure. Update total applied credits on PopulateAggregatedVeteranCredits stored procedure.', '1873', NULL, '2022-07-12 12:00:00'),

-- Wednesday, July 13, 2022
(NEWID(), @albertoUserId, '2022-07-13', '12pm Update', 'Adjust component for CPL Exhibit and Courses page. Component adjustments completed.', '1840', NULL, '2022-07-13 12:00:00'),

(NEWID(), @albertoUserId, '2022-07-13', 'EOD Update', 'Meeting with Pedro C. to review pending tickets. Setup dev environment for CPL Landing pages with Sierra, Alex and Pedro, we run on some issues will continue tomorrow with the training session.', '', NULL, '2022-07-13 12:00:00'),

-- Friday, July 15, 2022
(NEWID(), @albertoUserId, '2022-07-15', '12pm Update', 'Updated front-end according Alex Mockup. Pending Pedro C. confirmation of DB changes for GetPotencialCPLS avings.', '1840', NULL, '2022-07-15 12:00:00'),

(NEWID(), @albertoUserId, '2022-07-15', 'EOD Update', 'Deploy Ivan changes into QA. Update GetPotentialSavings SP to show Transcribed credits.', '1834', NULL, '2022-07-15 12:00:00')

-- Verify the import
SELECT 
    a.id,
    u.name as Developer,
    a.date,
    a.meetingType,
    a.note,
    a.tickets,
    a.createdAt
FROM DevTracker_Activities a
JOIN DevTracker_Users u ON a.userId = u.id
WHERE u.email = 'alberto.gandarillas@gmail.com'
AND a.date BETWEEN '2022-07-11' AND '2022-07-15'
ORDER BY a.date, a.meetingType 