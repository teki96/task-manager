import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select } from './ui/select'
import { Alert, AlertDescription } from './ui/alert'

export const TaskForm = ({
  isLoading,
  onSubmit,
  initialData = null,
  onCancel = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      description: '',
      priority: 'medium',
      deadline: '',
    },
  )
  const [formError, setFormError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!formData.title.trim()) {
      setFormError('Task title is required')
      return
    }

    const result = await onSubmit(formData)

    if (result.success) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        deadline: '',
      })
      setFormError('')
    } else {
      setFormError(result.error)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      deadline: '',
    })
    setFormError('')
    if (onCancel) onCancel()
  }

  return (
    <form
      className={`space-y-4 rounded-lg border p-6 ${
        isEditing ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
      }`}
      onSubmit={handleSubmit}
    >
      {isEditing && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Edit Task</h3>
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor={isEditing ? 'edit-title' : 'title'}>
            Task Title *
          </Label>
          <Input
            id={isEditing ? 'edit-title' : 'title'}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter task title"
            disabled={isLoading}
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={isEditing ? 'edit-description' : 'description'}>
          Description
        </Label>
        <Textarea
          id={isEditing ? 'edit-description' : 'description'}
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter task description"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={isEditing ? 'edit-priority' : 'priority'}>
            Priority
          </Label>
          <Select
            id={isEditing ? 'edit-priority' : 'priority'}
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            disabled={isLoading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={isEditing ? 'edit-deadline' : 'deadline'}>
            Deadline
          </Label>
          <Input
            id={isEditing ? 'edit-deadline' : 'deadline'}
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            disabled={isLoading}
            className="h-10"
          />
        </div>
      </div>

      {formError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {formError}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 h-8 text-sm flex items-center justify-center"
        >
          {isLoading
            ? isEditing
              ? 'Saving...'
              : 'Creating...'
            : isEditing
              ? 'Save Changes'
              : 'Create Task'}
        </Button>
        {isEditing && (
          <Button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-400 hover:bg-gray-500 h-8 text-sm flex items-center justify-center"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
