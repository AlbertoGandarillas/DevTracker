# Developer Activity Tracker

A minimalist, modern web application to streamline daily activity reporting for development teams. Built with **Next.js**, **Tailwind CSS**, **ShadCN UI**, and **Prisma ORM**, this app replaces manual Google Sheet tracking. It features seamless Gmail authentication, a simple dashboard for activity entry, calendar-based review, and an admin overview for team leads—all with best React, design, and scalability practices.

## Features

- **Single-Click Google Sign-In** (via Clerk)
- **Personal Dashboard:**  
  - Quick daily updates with a single text input  
  - Recent submissions preview
- **Calendar/History:**  
  - Browse and filter prior updates  
  - Highlight active days; detail view per day
- **Admin Overview:**  
  - Global activity view for all users
  - Powerful filters (by date, user, keyword)
  - CSV export option
- **Responsive & Minimal UI:**  
  - Built with ShadCN and Tailwind for clarity and accessibility  
  - Clean, distraction-free design
- **Future-Ready:**  
  - Reusable React components, scalable database, and clear separation of concerns

## Tech Stack

| Layer             | Technology                      |
|-------------------|--------------------------------|
| Frontend          | Next.js, Tailwind CSS, ShadCN   |
| Authentication    | Clerk (Google OAuth)            |
| Database          | Azure SQL Server (via Prisma)   |
| ORM               | Prisma ORM                      |
| Deployment        | Vercel                          |

## Screenshots (coming soon)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/dev-activity-tracker.git
cd dev-activity-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file and add:

```
DATABASE_URL=mssql://:@:1433/?encrypt=true
CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

> Adjust values to match your Azure SQL and Clerk configurations.

### 4. Database Setup

Define your schema in `prisma/schema.prisma` as per project requirements. Example:

```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  name      String?
  role      String
  activities Activity[]
  createdAt DateTime  @default(now())
}

model Activity {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  date        DateTime
  meetingType String?
  note        String?
  tickets     String?
  progress    String?
  createdAt   DateTime  @default(now())
}
```

Push schema to database:

```bash
npx prisma db push
npx prisma generate
```

### 5. Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Deployment

- Push your code to GitHub.
- Connect repo to Vercel for continuous deployment (auto-detects Next.js).
- Set up production environment variables on Vercel.

## UI & Component Overview

- **/components:**  
  - `ActivityInput` — for submitting updates  
  - `ActivityCalendar` — calendar/history UI  
  - `ActivityList` — recent activity  
  - `AdminGlobalView` — admin-only view

- **Pages:**  
  - `/` — Dashboard  
  - `/history` — Calendar & history  
  - `/admin` — Admin panel

- **APIs:**  
  - `/api/activities` — CRUD endpoints (secured)

## Best Practices

- Functional React components using hooks
- Strict TypeScript typings
- Clear separation: logic in `/api`, UI in `/components`
- Only authenticated users access data  
  - Admin access via user role
- Accessibility built-in (keyboard navigation, proper labels)

## Contributing

1. Fork and clone the repo.
2. Create a feature branch.
3. Submit pull requests for review.

## Roadmap

- Mobile-first UI & PWA enhancements
- Advanced reporting/analytics
- Custom notification system
- Deeper ticket management features

## License

MIT

## Credits

- ShadCN (UI)
- Clerk (Authentication)
- Prisma
- Inspired by internal workflow improvements for developer teams
