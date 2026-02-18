import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Select } from './ui/select'

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
    <div className="rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow">
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="flex-1 text-lg font-semibold text-gray-900">
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
          <Select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="h-8 border-0 bg-gray-100 text-sm p-1"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </Select>
        </div>
      </div>

      {task.description && (
        <p className="mb-3 text-gray-700">{task.description}</p>
      )}

      <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-500">
        {task.deadline && (
          <span className="flex items-center gap-1">
            📅 {formatDate(task.deadline)}
          </span>
        )}
        {task.createdAt && (
          <span className="flex items-center gap-1">
            📝 Created {formatDate(task.createdAt)}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onEdit(task)}
          disabled={isLoading || isEditing}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 h-8 text-sm flex items-center justify-center"
        >
          ✏️ Edit
        </Button>
        <Button
          onClick={() => onDelete(task.id)}
          disabled={isLoading || isEditing}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 h-8 text-sm flex items-center justify-center"
        >
          🗑️ Delete
        </Button>
      </div>
    </div>
  )
}
