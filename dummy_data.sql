-- Insert dummy users into DevTracker_Users table
INSERT INTO [dbo].[DevTracker_Users] (Id, Email, Name, Role, CreatedAt)
VALUES 
    (NEWID(), 'alberto.gandarillas@theinfotechpartners.com', 'Alberto Gandarillas', 'user', SYSDATETIME()),
    (NEWID(), 'pedro.campos@theinfotechpartners.com', 'Pedro Campos', 'user', SYSDATETIME()),
    (NEWID(), 'acgl2015@gmail.com', 'Admin User', 'admin', SYSDATETIME());

-- Optional: Insert some sample activities
INSERT INTO [dbo].[DevTracker_Activities] (Id, UserId, Date, MeetingType, Note, Tickets, Progress, CreatedAt)
SELECT 
    NEWID(),
    u.Id,
    CAST(GETDATE() AS DATE),
    'Daily Standup',
    'Team sync meeting',
    'TICKET-001, TICKET-002',
    'Completed initial setup',
    SYSDATETIME()
FROM [dbo].[DevTracker_Users] u
WHERE u.Email = 'alberto.gandarillas@theinfotechpartners.com';

INSERT INTO [dbo].[DevTracker_Activities] (Id, UserId, Date, MeetingType, Note, Tickets, Progress, CreatedAt)
SELECT 
    NEWID(),
    u.Id,
    CAST(GETDATE() AS DATE),
    'Code Review',
    'Reviewed pull requests',
    'TICKET-003',
    'In progress',
    SYSDATETIME()
FROM [dbo].[DevTracker_Users] u
WHERE u.Email = 'pedro.campos@theinfotechpartners.com'; 