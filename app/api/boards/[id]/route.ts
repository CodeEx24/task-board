import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteParams = {
  params: Promise<{ id: string }>
}

// GET /api/boards/[id] - Get single board with all its tasks
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    })

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(board, { status: 200 })
  } catch (error) {
    console.error('Error fetching board:', error)
    return NextResponse.json(
      { error: 'Failed to fetch board' },
      { status: 500 }
    )
  }
}

// DELETE /api/boards/[id] - Delete a board
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if board exists
    const existingBoard = await prisma.board.findUnique({
      where: { id },
    })

    if (!existingBoard) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      )
    }

    const deletedBoard = await prisma.board.delete({
      where: { id },
    })

    return NextResponse.json(deletedBoard, { status: 200 })
  } catch (error) {
    console.error('Error deleting board:', error)
    return NextResponse.json(
      { error: 'Failed to delete board' },
      { status: 500 }
    )
  }
}
