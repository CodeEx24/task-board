# Task Board

A modern, full-stack task management application built with Next.js 16. Organize your work with customizable boards and tasks in a clean, intuitive kanban-style interface.

## Features

- **Multiple Boards** - Create and manage separate boards for different projects or workflows
- **Kanban View** - Visual task organization with drag-and-drop support
- **Task Management** - Create, edit, and delete tasks with titles, descriptions, and status tracking
- **Real-time Updates** - Instant UI updates when managing tasks
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Dark Mode** - Automatic theme switching based on system preferences

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16 | React framework with App Router |
| React | 19 | UI library |
| TypeScript | Strict | Type-safe development |
| Tailwind CSS | 4 | Utility-first styling |
| Prisma | 7 | ORM with PostgreSQL adapter |
| Supabase | - | PostgreSQL database hosting |
| Node.js | 18+ | Runtime environment |

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** (comes with Node.js)
- **Supabase account** - [Sign up for free](https://supabase.com)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-board
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase Project

1. Create a new project at [supabase.com](https://supabase.com)
2. Navigate to **Project Settings** > **Database**
3. Copy the connection strings (you'll need both pooling and direct URLs)

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:

```env
# Supabase connection pooling URL (port 6543)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase session mode URL for migrations (port 5432)
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

### 5. Run Database Migrations

```bash
npx prisma migrate dev
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
task-board/
├── app/                    # Next.js App Router pages and layouts
│   ├── api/               # API route handlers
│   ├── boards/            # Board-related pages
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── lib/                   # Utility functions and shared logic
├── prisma/
│   ├── schema.prisma      # Database schema definition
│   └── migrations/        # Database migration files
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

## API Endpoints

### Boards

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | Get all boards |
| POST | `/api/boards` | Create a new board |
| GET | `/api/boards/[id]` | Get a specific board |
| PUT | `/api/boards/[id]` | Update a board |
| DELETE | `/api/boards/[id]` | Delete a board |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (with optional board filter) |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/[id]` | Get a specific task |
| PUT | `/api/tasks/[id]` | Update a task |
| DELETE | `/api/tasks/[id]` | Delete a task |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint for code quality checks |
| `npx prisma studio` | Open Prisma Studio to view and edit database |
| `npx prisma migrate dev` | Run database migrations in development |
| `npx prisma generate` | Generate Prisma client after schema changes |

## Database Schema

The application uses two primary models:

### Board

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (CUID) |
| name | String | Board name |
| description | String? | Optional board description |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| tasks | Task[] | Related tasks |

### Task

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (CUID) |
| title | String | Task title |
| description | String? | Optional task description |
| status | String | Task status (e.g., "todo", "in-progress", "done") |
| order | Int | Position order within status column |
| boardId | String | Reference to parent board |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit them
   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features when applicable
- Update documentation as needed
- Ensure all linting checks pass (`npm run lint`)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Built with Next.js and Supabase
