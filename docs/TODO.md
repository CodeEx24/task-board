# Task Board System - Implementation Todo List

Based on PRD: Developer Assessment Task Board System (2-hour assessment)

## Phase 1: Project Setup (Est. 15-20 min) - COMPLETED

### Database & ORM Setup
- [x] Install Prisma ORM (`npm install prisma @prisma/client`)
- [x] Initialize Prisma with PostgreSQL/Supabase
- [x] Create `.env` file with DATABASE_URL and DIRECT_URL
- [x] Create `.env.example` file (template for others)
- [x] Create `prisma.config.ts` for Prisma 7 configuration
- [x] Install dotenv for environment variable loading
- [x] Install `@prisma/adapter-pg` and `pg` for Prisma 7 adapter pattern

### Prisma Schema - Board Model
- [x] Create Board model with required fields:
  - `id` (primary key, cuid)
  - `name` (String, required)
  - `createdAt` (DateTime, default now)
- [x] Add optional Board fields:
  - `description` (String, optional)
  - `color` (String, optional)
  - `updatedAt` (DateTime, auto-update)

### Prisma Schema - Task Model
- [x] Create Task model with required fields:
  - `id` (primary key, cuid)
  - `boardId` (foreign key to Board, required)
  - `title` (String, required)
  - `status` (String: "todo", "in_progress", "done")
  - `createdAt` (DateTime, default now)
- [x] Add optional Task fields:
  - `description` (String, optional)
  - `assignedTo` (String, optional)
  - `priority` (String: "low", "medium", "high")
  - `dueDate` (DateTime, optional)
  - `updatedAt` (DateTime, auto-update)
- [x] Set up Board-Task relationship (one-to-many)
- [x] Configure cascade delete (delete tasks when board is deleted)

### Database Migration
- [x] Run initial migration (`npx prisma migrate dev --name init`)
- [x] Generate Prisma client (`npx prisma generate`)
- [x] Enable Row Level Security (RLS) on all tables
- [x] Create permissive RLS policies (to be refined with auth)

### Prisma Client Setup
- [x] Create `lib/prisma.ts` with singleton pattern and pg adapter (prevents hot-reload issues)

### TypeScript Types (Partial - Phase 5)
- [x] Create `types/index.ts` with Board and Task interfaces
- [x] Create TaskStatus type ("todo" | "in_progress" | "done")
- [x] Create TaskPriority type ("low" | "medium" | "high")

---

## Phase 2: Backend API (Est. 30-40 min) - COMPLETED

### Board API Endpoints (`app/api/boards/`)
- [x] `POST /api/boards` - Create a new board
  - Validate: name is required
  - Return: 201 with created board
- [x] `GET /api/boards` - Get all boards
  - Return: 200 with array of boards (sorted by createdAt desc)
- [x] `GET /api/boards/[id]` - Get single board with all tasks
  - Return: 200 with board and tasks
  - Return: 404 if board not found
- [x] `DELETE /api/boards/[id]` - Delete a board
  - Return: 200 on success
  - Return: 404 if board not found

### Task API Endpoints (`app/api/tasks/`)
- [x] `POST /api/tasks` - Create a new task
  - Validate: boardId, title are required
  - Validate: board exists before creating task
  - Validate: status and priority values if provided
  - Return: 201 with created task
- [x] `GET /api/tasks?boardId=X` - Get tasks for a board
  - Return: 200 with array of tasks (sorted by createdAt desc)
  - Return: 400 if boardId not provided
- [x] `PATCH /api/tasks/[id]` - Update a task
  - Support updating: title, description, status, priority, assignedTo, dueDate
  - Validate: status and priority values if provided
  - Return: 200 with updated task
  - Return: 404 if task not found
- [x] `DELETE /api/tasks/[id]` - Delete a task
  - Return: 200 with deleted task
  - Return: 404 if task not found

### API Quality Requirements
- [x] Use correct HTTP methods (GET, POST, PATCH, DELETE)
- [x] Return correct status codes (200, 201, 400, 404, 500)
- [x] Validate required fields
- [x] Handle errors gracefully (try/catch, error responses)

### Files Created
- `app/api/boards/route.ts` - Board collection endpoints (GET, POST)
- `app/api/boards/[id]/route.ts` - Single board endpoints (GET, DELETE)
- `app/api/tasks/route.ts` - Task collection endpoints (GET, POST)
- `app/api/tasks/[id]/route.ts` - Single task endpoints (GET, PATCH, DELETE)

---

## Phase 3: Frontend - Dashboard Page (Est. 25-30 min)

### Route: `/` or `/dashboard`

### UI Components
- [ ] Create BoardCard component (displays single board)
- [ ] Create BoardList component (displays all boards)
- [ ] Create CreateBoardModal/Form component
- [ ] Add "Create New Board" button

### Functionality
- [ ] Fetch and display all boards from API
- [ ] Create new board with name input
- [ ] Navigate to board detail page on click
- [ ] Show loading state while fetching
- [ ] Show empty state if no boards exist
- [ ] Immediate UI update after creating board (no refresh)

---

## Phase 4: Frontend - Board Detail Page (Est. 30-35 min)

### Route: `/board/[id]`

### UI Components
- [ ] Create TaskCard component (displays single task)
- [ ] Create TaskColumn component (groups tasks by status)
- [ ] Create CreateTaskForm component
- [ ] Create EditTaskModal component
- [ ] Add back navigation to dashboard

### Layout
- [ ] Display board name at top
- [ ] Organize tasks into 3 columns by status:
  - Todo
  - In Progress
  - Done
- [ ] Add "Create Task" button/form

### Task CRUD Functionality
- [ ] Create new task with title (default status: "todo")
- [ ] Display all tasks for this board
- [ ] Change task status (todo → in_progress → done)
- [ ] Edit task title (inline or modal)
- [ ] Delete task with confirmation
- [ ] Immediate UI updates (no page refresh needed)

### Data Interaction Features
- [ ] Filter tasks by status (show only "todo", "in_progress", or "done")
- [ ] Sort tasks by field (createdAt, priority, etc.)
- [ ] Optimistic updates for status changes

---

## Phase 5: TypeScript Types (Throughout)

- [x] Create `types/index.ts` with Board interface
- [x] Create Task interface in `types/index.ts`
- [x] Create Status type ("todo" | "in_progress" | "done")
- [x] Create Priority type ("low" | "medium" | "high")
- [ ] Type all API responses
- [ ] Type all component props

---

## Phase 6: Documentation (Est. 15-20 min)

### README.md
- [ ] Requirements section (Node.js 18+, etc.)
- [ ] Setup instructions:
  1. Install dependencies
  2. Set up Supabase database
  3. Configure environment variables
  4. Run migrations
  5. Start dev server
- [ ] Tech stack list
- [ ] Available scripts

### AI_WORKFLOW.md
- [ ] Tool used (Claude Code)
- [ ] 2-3 example prompts with explanations
- [ ] Process description (what AI did vs manual coding)
- [ ] Time management breakdown
- [ ] What was skipped / future improvements

### ARCHITECTURE.md
- [ ] Technology choices and rationale
- [ ] Database design decisions
- [ ] API structure decisions
- [ ] Frontend organization
- [ ] Known limitations / future improvements

### Other Files
- [x] Create `.env.example` with template variables

---

## Bonus Features (Only if time permits)

### Option A - Analytics Dashboard
- [ ] Total tasks count across all boards
- [ ] Tasks count per status
- [ ] Completion percentage

### Option B - Real-Time Updates
- [ ] WebSocket or polling implementation
- [ ] Changes sync across browser tabs

### Option C - Export Data
- [ ] Export as JSON button
- [ ] Export as CSV button

---

## Minimum Requirements Checklist (Must Pass)

- [ ] Dashboard page showing all boards
- [ ] Can create a new board
- [ ] Can click a board to see its tasks
- [ ] Board detail page showing all tasks
- [ ] Can create a new task
- [ ] Can change task status
- [x] Data saves to database (persists after restart)
- [x] Basic error handling works
- [ ] README with setup instructions
- [ ] AI_WORKFLOW.md document
- [ ] ARCHITECTURE.md document

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 7 with pg adapter |
| Styling | Tailwind CSS 4 |

---

## Suggested Time Allocation (2 hours)

| Phase | Time | Status |
|-------|------|--------|
| Project Setup & Database | 15-20 min | COMPLETED |
| Backend API | 30-40 min | COMPLETED |
| Dashboard Page | 25-30 min | Pending |
| Board Detail Page | 30-35 min | Pending |
| Documentation | 15-20 min | Pending |
| Buffer/Debugging | 10-15 min | - |
