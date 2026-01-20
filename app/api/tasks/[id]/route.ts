import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { TaskStatus, TaskPriority } from '@/types'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/tasks/[id] - Get a single task
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    const task = await prisma.task.findUnique({
      where: { id }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(task, { status: 200 })
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/tasks/[id] - Update a task
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { title, description, status, priority, assignedTo, dueDate } = body

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Validate status if provided
    const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'done']
    if (status !== undefined && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: todo, in_progress, done' },
        { status: 400 }
      )
    }

    // Validate priority if provided
    const validPriorities: TaskPriority[] = ['low', 'medium', 'high']
    if (priority !== undefined && priority !== null && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority. Must be one of: low, medium, high' },
        { status: 400 }
      )
    }

    // Build update data with only provided fields
    const updateData: {
      title?: string
      description?: string | null
      status?: string
      priority?: string | null
      assignedTo?: string | null
      dueDate?: Date | null
    } = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (priority !== undefined) updateData.priority = priority
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null
    }

    // Update the task
    const task = await prisma.task.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(task, { status: 200 })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Delete the task
    const task = await prisma.task.delete({
      where: { id }
    })

    return NextResponse.json(task, { status: 200 })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
