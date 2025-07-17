-- Insert dummy users into DevTracker_Users table
INSERT INTO [dbo].[DevTracker_Users] (Id, Email, Name, Role, CreatedAt)
VALUES 
    (NEWID(), 'alberto.gandarillas@theinfotechpartners.com', 'Alberto Gandarillas', 'user', SYSDATETIME()),
    (NEWID(), 'pedro.campos@theinfotechpartners.com', 'Pedro Campos', 'user', SYSDATETIME()),
    (NEWID(), 'acgl2015@gmail.com', 'Admin User', 'admin', SYSDATETIME()),
    (NEWID(), 'david.takigawa@theinfotechpartners.com', 'David Takigawa', 'user', SYSDATETIME()),
    (NEWID(), 'lisa.simmons@theinfotechpartners.com', 'Lisa Simmons', 'user', SYSDATETIME()),
    (NEWID(), 'tom.simmons@theinfotechpartners.com', 'Tom Simmons', 'user', SYSDATETIME()),
    (NEWID(), 'carlos.hernandez@theinfotechpartners.com', 'Carlos Hernandez', 'user', SYSDATETIME()),
    (NEWID(), 'alex.campos@theinfotechpartners.com', 'Alex Campos', 'admin', SYSDATETIME()),
    (NEWID(), 'pedro.bernal@theinfotechpartners.com', 'Pedro Bernal', 'admin', SYSDATETIME()),
    (NEWID(), 'juan.costilla@theinfotechpartners.com', 'Juan Costilla', 'user', SYSDATETIME()),
    (NEWID(), 'ivan.acosta@theinfotechpartners.com', 'Ivan Acosta', 'user', SYSDATETIME()),
    (NEWID(), 'ryan.lertpichitkul@theinfotechpartners.com', 'Ryan Lertpichitkul', 'user', SYSDATETIME()),
    (NEWID(), 'patrick.roraff@theinfotechpartners.com', 'Patrick Roraff', 'user', SYSDATETIME()),
    (NEWID(), 'sierra.scott@theinfotechpartners.com', 'Sierra Scott', 'user', SYSDATETIME()),
    (NEWID(), 'chelsea.marada@theinfotechpartners.com', 'Chelsea Marada', 'user', SYSDATETIME()),
    (NEWID(), 'natalie.powell@theinfotechpartners.com', 'Natalie Powell', 'admin', SYSDATETIME()),
    (NEWID(), 'jonathan.campos@theinfotechpartners.com', 'Jonathan Campos', 'user', SYSDATETIME()),
    (NEWID(), 'ally.barker@theinfotechpartners.com', 'Ally Barker', 'user', SYSDATETIME()),
    (NEWID(), 'ana.campos@theinfotechpartners.com', 'Ana Campos', 'user', SYSDATETIME()),
    (NEWID(), 'briana.campos@theinfotechpartners.com', 'Briana Campos', 'user', SYSDATETIME());

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