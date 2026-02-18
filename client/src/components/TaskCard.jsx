import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Select } from './ui/select'
import { Calendar, FileText, Edit, Trash2 } from 'lucide-react'

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const TaskCard = ({
  task,
  isLoading,
  isEditing,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-lg transition-shadow">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
          <Select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="h-7 border-0 bg-gray-100 text-xs p-1 w-24"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </Select>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-3 text-xs text-gray-500">
        {task.deadline && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(task.deadline)}
          </span>
        )}
        {task.createdAt && (
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            {formatDate(task.createdAt)}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          disabled={isLoading || isEditing}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Edit task"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          disabled={isLoading || isEditing}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
