'use client'

import { useState } from 'react'
import type { Task, TaskStatus } from '@/types'

interface TaskCardProps {
  task: Task
  onStatusChange: (id: string, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; border: string }> = {
  todo: {
    label: 'To Do',
    bg: 'bg-gray-50 dark:bg-gray-800/50',
    border: 'border-l-gray-400',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-blue-50/50 dark:bg-blue-900/10',
    border: 'border-l-blue-500',
  },
  done: {
    label: 'Done',
    bg: 'bg-green-50/50 dark:bg-green-900/10',
    border: 'border-l-green-500',
  },
}

const PRIORITY_CONFIG: Record<string, { label: string; classes: string }> = {
  low: {
    label: 'Low',
    classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  medium: {
    label: 'Medium',
    classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  high: {
    label: 'High',
    classes: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
}

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  const statusConfig = STATUS_CONFIG[task.status]
  const priorityConfig = task.priority ? PRIORITY_CONFIG[task.priority] : null

  const formatDueDate = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const isOverdue = (date: Date) => {
    const now = new Date()
    const dueDate = new Date(date)
    now.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < now && task.status !== 'done'
  }

  const handleStatusSelect = (status: TaskStatus) => {
    onStatusChange(task.id, status)
    setShowStatusMenu(false)
  }

  return (
    <article
      className={`relative rounded-lg border border-gray-200 dark:border-gray-700 ${statusConfig.bg} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border-l-4 ${statusConfig.border} group`}
    >
      <div className="p-3">
        {/* Header: Title and action buttons */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
            {task.title}
          </h4>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              aria-label={`Edit task: ${task.title}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label={`Delete task: ${task.title}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Metadata row: priority, assignee, due date */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Priority badge */}
          {priorityConfig && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityConfig.classes}`}
            >
              {priorityConfig.label}
            </span>
          )}

          {/* Assignee */}
          {task.assignedTo && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="truncate max-w-[80px]">{task.assignedTo}</span>
            </span>
          )}

          {/* Due date */}
          {task.dueDate && (
            <span
              className={`inline-flex items-center gap-1 text-xs ${
                isOverdue(task.dueDate)
                  ? 'text-red-600 dark:text-red-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDueDate(task.dueDate)}</span>
              {isOverdue(task.dueDate) && (
                <span className="text-red-600 dark:text-red-400">(Overdue)</span>
              )}
            </span>
          )}
        </div>

        {/* Status change dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <span>{statusConfig.label}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${showStatusMenu ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Status dropdown menu */}
          {showStatusMenu && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowStatusMenu(false)}
              />
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg z-20 overflow-hidden">
                {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusSelect(status)}
                    disabled={status === task.status}
                    className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                      status === task.status
                        ? 'bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {STATUS_CONFIG[status].label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
