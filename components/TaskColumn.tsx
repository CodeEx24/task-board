'use client'

import type { Task, TaskStatus } from '@/types'
import TaskCard from '@/components/TaskCard'

interface TaskColumnProps {
  status: TaskStatus
  tasks: Task[]
  onStatusChange: (id: string, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const statusConfig: Record<TaskStatus, { label: string; headerBg: string; headerText: string; countBg: string }> = {
  todo: {
    label: 'Todo',
    headerBg: 'bg-gray-100 dark:bg-gray-700',
    headerText: 'text-gray-700 dark:text-gray-200',
    countBg: 'bg-gray-200 dark:bg-gray-600',
  },
  in_progress: {
    label: 'In Progress',
    headerBg: 'bg-blue-100 dark:bg-blue-900/40',
    headerText: 'text-blue-700 dark:text-blue-200',
    countBg: 'bg-blue-200 dark:bg-blue-800',
  },
  done: {
    label: 'Done',
    headerBg: 'bg-green-100 dark:bg-green-900/40',
    headerText: 'text-green-700 dark:text-green-200',
    countBg: 'bg-green-200 dark:bg-green-800',
  },
}

export default function TaskColumn({
  status,
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskColumnProps) {
  const config = statusConfig[status]
  const taskCount = tasks.length

  return (
    <section className="flex flex-col min-h-[200px] md:min-h-[400px] w-full md:w-80 md:flex-shrink-0 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
      {/* Column Header */}
      <header className={`flex items-center justify-between px-4 py-3 ${config.headerBg}`}>
        <h2 className={`font-semibold text-sm ${config.headerText}`}>
          {config.label}
        </h2>
        <span
          className={`inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 text-xs font-medium rounded-full ${config.countBg} ${config.headerText}`}
        >
          {taskCount}
        </span>
      </header>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {taskCount === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No tasks
            </p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
              {status === 'todo' && 'Add a task to get started'}
              {status === 'in_progress' && 'Move tasks here when working on them'}
              {status === 'done' && 'Completed tasks will appear here'}
            </p>
          </div>
        ) : (
          /* Task List */
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  )
}
