'use client'

import { useState, useId } from 'react'

interface CreateBoardFormProps {
  onSubmit: (data: { name: string; description?: string; color?: string }) => Promise<void>
  onCancel?: () => void
}

const COLOR_PRESETS = [
  { name: 'red', value: '#ef4444' },
  { name: 'orange', value: '#f97316' },
  { name: 'yellow', value: '#eab308' },
  { name: 'green', value: '#22c55e' },
  { name: 'blue', value: '#3b82f6' },
  { name: 'purple', value: '#a855f7' },
  { name: 'pink', value: '#ec4899' },
  { name: 'gray', value: '#6b7280' },
] as const

export default function CreateBoardForm({ onSubmit, onCancel }: CreateBoardFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const formId = useId()
  const nameId = `${formId}-name`
  const descriptionId = `${formId}-description`
  const colorId = `${formId}-color`
  const errorId = `${formId}-error`

  const resetForm = () => {
    setName('')
    setDescription('')
    setSelectedColor(undefined)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Board name is required')
      return
    }

    setIsLoading(true)

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        color: selectedColor,
      })
      resetForm()
      setIsExpanded(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create board. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    setIsExpanded(false)
    onCancel?.()
  }

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300"
      >
        <span className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Board
        </span>
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      aria-describedby={error ? errorId : undefined}
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Create New Board
      </h2>

      {error && (
        <div
          id={errorId}
          role="alert"
          className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400"
        >
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor={nameId}
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id={nameId}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter board name"
            required
            aria-required="true"
            disabled={isLoading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-400 dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label
            htmlFor={descriptionId}
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id={descriptionId}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter board description"
            rows={3}
            disabled={isLoading}
            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-400 dark:disabled:bg-gray-800"
          />
        </div>

        <fieldset>
          <legend
            id={colorId}
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Color <span className="text-gray-400">(optional)</span>
          </legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby={colorId}>
            {COLOR_PRESETS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(selectedColor === color.value ? undefined : color.value)}
                disabled={isLoading}
                aria-label={`${color.name}${selectedColor === color.value ? ' (selected)' : ''}`}
                aria-pressed={selectedColor === color.value}
                className={`h-8 w-8 rounded-full transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed ${
                  selectedColor === color.value
                    ? 'scale-110 ring-2 ring-gray-900 ring-offset-2 dark:ring-gray-100'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-400/50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating...
            </span>
          ) : (
            'Create Board'
          )}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:disabled:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
