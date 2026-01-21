# Architecture Documentation

This document provides a comprehensive overview of the Task Board application architecture, designed to help developers understand the system design, technology choices, and implementation patterns.

## Table of Contents

1. [Overview](#overview)
2. [Technology Choices & Rationale](#technology-choices--rationale)
3. [Project Structure](#project-structure)
4. [Database Design](#database-design)
5. [API Structure](#api-structure)
6. [Frontend Architecture](#frontend-architecture)
7. [Data Flow](#data-flow)
8. [Security Considerations](#security-considerations)
9. [Known Limitations](#known-limitations)
10. [Future Improvements](#future-improvements)

---

## Overview

The Task Board is a Kanban-style project management application that allows users to organize work into boards and tasks. The application follows a modern full-stack architecture using Next.js as the primary framework, with a PostgreSQL database managed through Supabase.

**Key architectural decisions:**

- **Server-first approach**: Leveraging React Server Components for optimal performance
- **Type safety throughout**: TypeScript from frontend to database queries
- **Edge-compatible**: Using Prisma's adapter pattern for serverless/edge deployment
- **Security by default**: Row Level Security (RLS) at the database layer

---

## Technology Choices & Rationale

### Next.js 16

**Why chosen:**

- **App Router**: The App Router provides a more intuitive file-based routing system with support for layouts, loading states, and error boundaries built-in
- **React Server Components (RSC)**: Enables server-side rendering by default, reducing client-side JavaScript bundle size and improving initial page load
- **API Routes**: Collocated API endpoints within the same project, simplifying deployment and development
- **Built-in optimizations**: Automatic code splitting, image optimization, and font optimization

### React 19

**Why chosen:**

- **Improved Server Components**: Enhanced RSC support with better streaming and suspense handling
- **Actions**: Simplified form handling and mutations with server actions
- **Use hook**: New `use` hook for reading resources in render, including context and promises
- **Performance**: Continued improvements to concurrent rendering and automatic batching

### TypeScript (Strict Mode)

**Why chosen:**

- **Type safety**: Catch errors at compile time rather than runtime
- **Better developer experience**: Enhanced IDE support with autocomplete, refactoring, and inline documentation
- **Self-documenting code**: Types serve as documentation for function signatures and data structures
- **Prisma integration**: Generated types from database schema ensure type safety from UI to database

### Tailwind CSS 4

**Why chosen:**

- **Utility-first approach**: Rapid UI development without context-switching to CSS files
- **New CSS syntax**: Uses modern `@import "tailwindcss"` syntax instead of legacy `@tailwind` directives
- **CSS variables for theming**: Native support for design tokens and theme customization
- **Automatic dark mode**: Built-in `prefers-color-scheme` support
- **Smaller bundle sizes**: Only includes CSS classes that are actually used

### Prisma 7

**Why chosen:**

- **Type-safe ORM**: Auto-generated TypeScript types from database schema
- **Adapter pattern**: The `@prisma/adapter-pg` enables edge runtime compatibility with Supabase
- **Migration system**: Version-controlled database schema changes
- **Intuitive query API**: Readable, chainable query builder
- **Relation handling**: Simple syntax for working with related data

### Supabase (PostgreSQL)

**Why chosen:**

- **Managed PostgreSQL**: Production-ready database without DevOps overhead
- **Row Level Security (RLS)**: Database-level security policies for fine-grained access control
- **Connection pooling**: Built-in PgBouncer for efficient connection management in serverless environments
- **Real-time capabilities**: WebSocket-based subscriptions for future real-time features
- **Authentication ready**: Built-in auth system when needed for future user management

---

## Project Structure

```
task-board/
├── app/                        # Next.js App Router
│   ├── api/                    # API route handlers
│   │   ├── boards/             # Board CRUD endpoints
│   │   │   ├── route.ts        # GET all, POST new board
│   │   │   └── [id]/
│   │   │       └── route.ts    # GET, DELETE single board
│   │   └── tasks/              # Task CRUD endpoints
│   │       ├── route.ts        # GET all, POST new task
│   │       └── [id]/
│   │           └── route.ts    # GET, PATCH, DELETE single task
│   ├── board/
│   │   └── [id]/
│   │       └── page.tsx        # Board detail page (Kanban view)
│   ├── globals.css             # Global styles & CSS variables
│   ├── layout.tsx              # Root layout with metadata
│   └── page.tsx                # Dashboard / Board list
│
├── components/                 # React components
│   ├── ui/                     # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── BoardCard.tsx           # Board preview card
│   ├── BoardColumn.tsx         # Kanban column (status)
│   ├── TaskCard.tsx            # Individual task card
│   ├── CreateBoardModal.tsx    # New board form
│   └── CreateTaskModal.tsx     # New task form
│
├── lib/                        # Shared utilities
│   ├── prisma.ts               # Prisma client singleton
│   └── utils.ts                # Helper functions
│
├── prisma/                     # Database configuration
│   ├── schema.prisma           # Database schema definition
│   └── migrations/             # Migration history
│
├── types/                      # TypeScript type definitions
│   └── index.ts                # Shared types (Board, Task, etc.)
│
├── docs/                       # Documentation
│   └── ARCHITECTURE.md         # This file
│
├── .env.local                  # Environment variables (git-ignored)
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies & scripts
```

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────────────────────────┐
│              Board                   │
├─────────────────────────────────────┤
│ id          String     @id @uuid    │
│ name        String                   │
│ description String?                  │
│ color       String     @default     │
│ createdAt   DateTime   @default     │
│ updatedAt   DateTime   @updatedAt   │
├─────────────────────────────────────┤
│ tasks       Task[]     (1:many)     │
└─────────────────────────────────────┘
            │
            │ One-to-Many
            │ (boardId foreign key)
            ▼
┌─────────────────────────────────────┐
│              Task                    │
├─────────────────────────────────────┤
│ id          String     @id @uuid    │
│ title       String                   │
│ description String?                  │
│ status      TaskStatus @default     │
│ priority    Priority   @default     │
│ assignedTo  String?                  │
│ dueDate     DateTime?                │
│ boardId     String     @relation    │
│ createdAt   DateTime   @default     │
│ updatedAt   DateTime   @updatedAt   │
└─────────────────────────────────────┘
```

### Schema Definition

```prisma
// prisma/schema.prisma

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Board {
  id          String   @id @default(uuid())
  name        String
  description String?
  color       String   @default("#3B82F6")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tasks       Task[]   @relation(onDelete: Cascade)
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  assignedTo  String?
  dueDate     DateTime?
  boardId     String
  board       Board      @relation(fields: [boardId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([boardId])
  @@index([status])
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

### Key Design Decisions

- **UUIDs for IDs**: Prevents enumeration attacks and allows client-side ID generation
- **Cascade delete**: When a board is deleted, all associated tasks are automatically removed
- **Indexed foreign keys**: The `boardId` index optimizes queries for fetching tasks by board
- **Status index**: Enables efficient filtering of tasks by status
- **Soft timestamps**: `createdAt` and `updatedAt` for audit trails

---

## API Structure

### RESTful Design Principles

All API routes follow REST conventions with consistent response formats and HTTP status codes.

### Response Format

```typescript
// Success response
{
  "data": { ... },
  "meta"?: { ... }
}

// Error response
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE"
  }
}
```

### Board Endpoints

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/api/boards` | List all boards | 200, 500 |
| POST | `/api/boards` | Create a new board | 201, 400, 500 |
| GET | `/api/boards/[id]` | Get board with tasks | 200, 404, 500 |
| DELETE | `/api/boards/[id]` | Delete board and tasks | 204, 404, 500 |

**Example: Create Board**

```typescript
// POST /api/boards
// Request body
{
  "name": "Project Alpha",
  "description": "Main development board",
  "color": "#10B981"
}

// Response (201 Created)
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Project Alpha",
    "description": "Main development board",
    "color": "#10B981",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Task Endpoints

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/api/tasks` | List tasks (with filters) | 200, 500 |
| POST | `/api/tasks` | Create a new task | 201, 400, 500 |
| GET | `/api/tasks/[id]` | Get single task | 200, 404, 500 |
| PATCH | `/api/tasks/[id]` | Update task fields | 200, 400, 404, 500 |
| DELETE | `/api/tasks/[id]` | Delete task | 204, 404, 500 |

**Query Parameters for GET /api/tasks:**

- `boardId` - Filter by board
- `status` - Filter by status (TODO, IN_PROGRESS, IN_REVIEW, DONE)
- `priority` - Filter by priority

**Example: Update Task Status**

```typescript
// PATCH /api/tasks/[id]
// Request body
{
  "status": "IN_PROGRESS"
}

// Response (200 OK)
{
  "data": {
    "id": "...",
    "title": "Implement feature X",
    "status": "IN_PROGRESS",
    ...
  }
}
```

### Error Handling Pattern

```typescript
// app/api/boards/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: boards });
  } catch (error) {
    console.error('Failed to fetch boards:', error);
    return NextResponse.json(
      { error: { message: 'Failed to fetch boards', code: 'FETCH_ERROR' } },
      { status: 500 }
    );
  }
}
```

---

## Frontend Architecture

### Component Hierarchy

```
App (layout.tsx)
└── Page (page.tsx / board/[id]/page.tsx)
    ├── Header
    │   └── Navigation
    ├── BoardList (dashboard)
    │   └── BoardCard (repeating)
    │       └── TaskCount badge
    └── BoardView (board detail)
        ├── BoardHeader
        │   ├── BoardTitle
        │   └── CreateTaskButton
        └── ColumnContainer
            └── BoardColumn (repeating for each status)
                └── TaskCard (repeating)
                    ├── TaskTitle
                    ├── PriorityBadge
                    ├── AssigneeAvatar
                    └── DueDate
```

### State Management Strategy

The application uses React's built-in state management:

```typescript
// Local component state for UI interactions
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedTask, setSelectedTask] = useState<Task | null>(null);

// Data state with loading and error handling
const [boards, setBoards] = useState<Board[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**Why no external state management library?**

- Application state is relatively simple (boards and tasks)
- React 19's improved state handling reduces need for external solutions
- Data fetching is primarily done via API calls, not cached globally
- Keeps bundle size minimal

### Data Fetching Pattern

```typescript
// Client-side fetching with useEffect
'use client';

import { useEffect, useState } from 'react';
import type { Board } from '@/types';

export default function Dashboard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBoards() {
      try {
        const response = await fetch('/api/boards');
        const { data } = await response.json();
        setBoards(data);
      } catch (error) {
        console.error('Failed to fetch boards:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBoards();
  }, []);

  // ... render
}
```

### Optimistic Updates

For better UX, status changes use optimistic updates:

```typescript
async function updateTaskStatus(taskId: string, newStatus: TaskStatus) {
  // Optimistically update UI
  setTasks(prev =>
    prev.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    )
  );

  try {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
  } catch (error) {
    // Revert on failure
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: originalStatus } : task
      )
    );
  }
}
```

### Responsive Design

Tailwind CSS breakpoints are used for responsive layouts:

```typescript
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {columns.map(column => (
    <BoardColumn key={column.status} {...column} />
  ))}
</div>
```

| Breakpoint | Layout |
|------------|--------|
| Mobile (<768px) | Single column, stacked cards |
| Tablet (768px+) | 2-column grid |
| Desktop (1024px+) | 4-column Kanban board |

---

## Data Flow

### Create Task Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                           USER ACTION                                 │
│                    Click "Add Task" button                           │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                              │
│  1. Open CreateTaskModal                                             │
│  2. User fills form (title, description, priority, etc.)             │
│  3. User clicks "Create"                                             │
│  4. Form validation (client-side)                                    │
│  5. setIsLoading(true)                                               │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         API LAYER (Next.js)                          │
│  POST /api/tasks                                                     │
│  1. Parse request body                                               │
│  2. Validate required fields                                         │
│  3. Sanitize input                                                   │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         DATABASE (Prisma)                            │
│  prisma.task.create({                                                │
│    data: { title, boardId, ... }                                     │
│  })                                                                  │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      SUPABASE (PostgreSQL)                           │
│  1. RLS policy check                                                 │
│  2. INSERT INTO tasks ...                                            │
│  3. Return created row                                               │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    RESPONSE FLOW (Reverse)                           │
│  1. Prisma returns typed Task object                                 │
│  2. API returns NextResponse.json({ data: task }, { status: 201 })   │
│  3. Frontend receives response                                       │
│  4. setTasks(prev => [...prev, newTask])                             │
│  5. Close modal, show success toast                                  │
└──────────────────────────────────────────────────────────────────────┘
```

### Update Task Status Flow

```
User clicks status    ──►  Optimistic UI update  ──►  PATCH /api/tasks/[id]
                                   │                           │
                                   │                           ▼
                                   │                    Prisma update
                                   │                           │
                                   │                           ▼
                                   │                    Database write
                                   │                           │
                           ┌───────┴───────┐                   │
                           │               │                   │
                     (on failure)    (on success)              │
                           │               │                   │
                           ▼               ▼                   │
                    Revert state     Keep state  ◄─────────────┘
```

---

## Security Considerations

### Row Level Security (RLS)

Supabase RLS is enabled to provide database-level security:

```sql
-- Example RLS policy (when auth is implemented)
CREATE POLICY "Users can view their own boards"
ON boards FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own boards"
ON boards FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**Current state:** RLS is enabled but policies are permissive since authentication is not yet implemented.

### Environment Variables

Sensitive configuration is stored in environment variables:

```bash
# .env.local (never committed to git)
DATABASE_URL="postgresql://..."      # Pooled connection (for serverless)
DIRECT_URL="postgresql://..."        # Direct connection (for migrations)
```

**Security practices:**

- `.env.local` is in `.gitignore`
- Environment variables are validated at build time
- Production secrets are managed through Vercel/deployment platform

### Input Validation

All API routes validate input before database operations:

```typescript
// Example validation in API route
export async function POST(request: Request) {
  const body = await request.json();

  // Validate required fields
  if (!body.title || typeof body.title !== 'string') {
    return NextResponse.json(
      { error: { message: 'Title is required', code: 'VALIDATION_ERROR' } },
      { status: 400 }
    );
  }

  // Sanitize and limit string length
  const title = body.title.trim().slice(0, 200);

  // Validate enum values
  if (body.status && !['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].includes(body.status)) {
    return NextResponse.json(
      { error: { message: 'Invalid status value', code: 'VALIDATION_ERROR' } },
      { status: 400 }
    );
  }

  // Proceed with database operation
  // ...
}
```

### Additional Security Measures

- **HTTPS only**: Enforced in production
- **CORS**: Handled by Next.js defaults
- **SQL Injection**: Prevented by Prisma's parameterized queries
- **XSS**: React's default escaping prevents most XSS attacks

---

## Known Limitations

### No Authentication

- All data is publicly accessible
- No user accounts or personal boards
- Anyone can create, modify, or delete any board/task

### No Drag-and-Drop

- Tasks cannot be reordered within columns
- Status changes require clicking through a dropdown/button
- No visual feedback during potential drag operations

### No Real-Time Sync

- Changes made by one user are not reflected for others without refresh
- No WebSocket or polling for updates
- Stale data possible in multi-user scenarios

### No Offline Support

- Application requires active internet connection
- No service worker or local caching strategy
- Forms don't queue submissions when offline

### Other Limitations

- No task comments or activity history
- No file attachments
- No task dependencies or blocking relationships
- No time tracking
- No recurring tasks
- Limited search (no full-text search)

---

## Future Improvements

### Authentication (Priority: High)

Implement user authentication using Supabase Auth:

```typescript
// Future implementation
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

// Sign in
await supabase.auth.signInWithOAuth({ provider: 'github' });

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

**Benefits:**

- Personal boards and tasks
- Team collaboration features
- Proper RLS policies

### Drag-and-Drop (Priority: High)

Implement using `@dnd-kit/core`:

```typescript
// Future implementation
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
    {tasks.map(task => <SortableTaskCard key={task.id} task={task} />)}
  </SortableContext>
</DndContext>
```

### Real-Time Updates (Priority: Medium)

Leverage Supabase Realtime:

```typescript
// Future implementation
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

useEffect(() => {
  const channel = supabase
    .channel('tasks')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' },
      (payload) => {
        // Handle real-time updates
        handleRealtimeUpdate(payload);
      }
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, []);
```

### Testing Suite (Priority: Medium)

Add comprehensive testing:

- **Unit tests**: Jest + React Testing Library for components
- **Integration tests**: Testing API routes with mock database
- **E2E tests**: Playwright for critical user flows

```typescript
// Example test structure
describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
  });

  it('shows priority badge', () => {
    render(<TaskCard task={{ ...mockTask, priority: 'URGENT' }} />);
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });
});
```

### Search and Filtering (Priority: Medium)

- Full-text search across task titles and descriptions
- Advanced filters (date ranges, multiple statuses)
- Saved filter presets

### Additional Improvements

| Feature | Priority | Complexity |
|---------|----------|------------|
| Task comments | Medium | Medium |
| File attachments | Low | High |
| Email notifications | Low | Medium |
| Board templates | Low | Low |
| Task labels/tags | Medium | Low |
| Keyboard shortcuts | Low | Low |
| Dark mode toggle | Low | Low |
| Export to CSV/PDF | Low | Medium |
| Activity audit log | Medium | Medium |
| Board sharing/permissions | Medium | High |

---

## Appendix

### Local Development Setup

```bash
# Clone repository
git clone <repository-url>
cd task-board

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run lint         # Run ESLint
npm run build        # Production build

# Database
npx prisma studio    # Open Prisma GUI
npx prisma migrate dev --name <name>  # Create migration
npx prisma generate  # Regenerate client
npx prisma db push   # Push schema changes (dev only)
```

### Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Pooled PostgreSQL connection string | Yes |
| `DIRECT_URL` | Direct PostgreSQL connection (for migrations) | Yes |

---

*Last updated: January 2026*
