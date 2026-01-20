'use client'

import { useState, useEffect, useCallback } from 'react'
import BoardCard from '@/components/BoardCard'
import CreateBoardForm from '@/components/CreateBoardForm'
import type { Board } from '@/types'

export default function Dashboard() {
  const [boards, setBoards] = useState<Board[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchBoards = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/boards')
      if (!response.ok) {
        throw new Error('Failed to fetch boards')
      }
      const data = await response.json()
      setBoards(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching boards')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  const handleCreateBoard = async (data: { name: string; description?: string; color?: string }) => {
    const response = await fetch('/api/boards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create board')
    }

    const newBoard = await response.json()
    // Optimistic update - add new board to state immediately
    setBoards((prev) => [newBoard, ...prev])
  }

  const handleDeleteClick = (boardId: string) => {
    setDeleteConfirm(boardId)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return

    const boardToDelete = deleteConfirm
    const previousBoards = boards

    // Optimistic update - remove board from state immediately
    setBoards((prev) => prev.filter((board) => board.id !== boardToDelete))
    setDeleteConfirm(null)

    try {
      const response = await fetch(`/api/boards/${boardToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete board')
      }
    } catch (err) {
      // Revert optimistic update on error
      setBoards(previousBoards)
      setError(err instanceof Error ? err.message : 'Failed to delete board')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm(null)
  }

  const boardToDeleteName = deleteConfirm
    ? boards.find((b) => b.id === deleteConfirm)?.name || 'this board'
    : ''

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Task Board
            </h1>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your projects and tasks in one place
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto rounded-md p-1 hover:bg-red-100 dark:hover:bg-red-800/50"
              aria-label="Dismiss error"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Create board form */}
        <section className="mb-8">
          <CreateBoardForm onSubmit={handleCreateBoard} />
        </section>

        {/* Boards section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Your Boards
            </h2>
            {!isLoading && boards.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {boards.length} {boards.length === 1 ? 'board' : 'boards'}
              </span>
            )}
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="p-4 sm:p-5">
                    <div className="mb-3 h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="mb-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="mt-6 flex justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && boards.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                No boards yet
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating your first board to organize your tasks.
              </p>
            </div>
          )}

          {/* Boards grid */}
          {!isLoading && boards.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {boards.map((board) => (
                <BoardCard key={board.id} board={board} onDelete={handleDeleteClick} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Delete confirmation dialog */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleDeleteCancel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  id="delete-dialog-title"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  Delete Board
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete &quot;{boardToDeleteName}&quot;? This action cannot
                  be undone and all tasks in this board will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3 sm:justify-end">
              <button
                type="button"
                onClick={handleDeleteCancel}
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:flex-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-600 sm:flex-none"
              >
                Delete Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
