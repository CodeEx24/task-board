'use client'

import Link from 'next/link'
import type { Board } from '@/types'

interface BoardCardProps {
  board: Board
  onDelete?: (id: string) => void
}

export default function BoardCard({ board, onDelete }: BoardCardProps) {
  const taskCount = board.tasks?.length ?? 0
  const accentColor = board.color ?? '#6366f1'

  const formattedDate = new Date(board.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete?.(board.id)
  }

  return (
    <Link href={`/board/${board.id}`} className="block group">
      <article
        className="relative h-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
        style={{ borderLeftColor: accentColor, borderLeftWidth: '4px' }}
      >
        {/* Delete button */}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            aria-label={`Delete board: ${board.name}`}
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
        )}

        <div className="p-4 sm:p-5">
          {/* Color accent bar (top) for additional visual interest */}
          <div
            className="absolute top-0 left-0 right-0 h-1 opacity-30"
            style={{ backgroundColor: accentColor }}
          />

          {/* Board name */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 pr-6 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {board.name}
          </h3>

          {/* Description */}
          {board.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {board.description}
            </p>
          )}

          {/* Footer with metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
            {/* Task count */}
            {board.tasks !== undefined && (
              <div className="flex items-center gap-1">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <span>
                  {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                </span>
              </div>
            )}

            {/* Created date */}
            <div className="flex items-center gap-1">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Created {formattedDate}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
