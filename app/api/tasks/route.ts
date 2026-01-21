import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { TaskStatus, TaskPriority } from '@/types'

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { boardId, title, description, status, priority, assignedTo, dueDate } = body

    // Validate required fields
    if (!boardId) {
      return NextResponse.json(
        { error: 'boardId is required' },
        { status: 400 }
      )
    }

    if (!title) {
      return NextResponse.json(
        { error: 'title is required' },
        { status: 400 }
      )
    }

    // Validate boardId exists
    const board = await prisma.board.findUnique({
      where: { id: boardId }
    })

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      )
    }

    // Validate status if provided
    const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'done']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: todo, in_progress, done' },
        { status: 400 }
      )
    }

    // Validate priority if provided
    const validPriorities: TaskPriority[] = ['low', 'medium', 'high']
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority. Must be one of: low, medium, high' },
        { status: 400 }
      )
    }

    // Create the task
    const task = await prisma.task.create({
      data: {
        boardId,
        title,
        description: description ?? null,
        status: status ?? 'todo',
        priority: priority ?? null,
        assignedTo: assignedTo ?? null,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/tasks?boardId=X - Get tasks for a board
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const boardId = searchParams.get('boardId')

    // Validate boardId is provided
    if (!boardId) {
      return NextResponse.json(
        { error: 'boardId query parameter is required' },
        { status: 400 }
      )
    }

    // Get tasks for the board, sorted by order then createdAt
    const tasks = await prisma.task.findMany({
      where: { boardId },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })

    return NextResponse.json(tasks, { status: 200 })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
