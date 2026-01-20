export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Board {
  id: string
  name: string
  description: string | null
  color: string | null
  createdAt: Date
  updatedAt: Date
  tasks?: Task[]
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority | null
  assignedTo: string | null
  dueDate: Date | null
  createdAt: Date
  updatedAt: Date
  boardId: string
  board?: Board
}
