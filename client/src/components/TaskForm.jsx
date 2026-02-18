import { useState } from 'react'
import { X } from 'lucide-react'
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
      className={`rounded-lg border shadow-lg transition-all ${
        isEditing
          ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8'
          : 'border-gray-200 bg-gray-50 p-6'
      }`}
      onSubmit={handleSubmit}
    >
      {isEditing && (
        <div className="mb-6 flex items-center justify-between border-b border-blue-200 pb-4">
          <h3 className="text-xl font-bold text-slate-900">Edit Task</h3>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg p-1 text-slate-400 hover:bg-blue-200 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor={isEditing ? 'edit-title' : 'title'}
            className="text-sm font-semibold text-slate-700"
          >
            Task Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id={isEditing ? 'edit-title' : 'title'}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter task title"
            disabled={isLoading}
            className="h-10 border-slate-200 focus:border-blue-400 focus:ring-blue-100"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={isEditing ? 'edit-description' : 'description'}
            className="text-sm font-semibold text-slate-700"
          >
            Description
          </Label>
          <Textarea
            id={isEditing ? 'edit-description' : 'description'}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter task description"
            disabled={isLoading}
            className="min-h-24 border-slate-200 focus:border-blue-400 focus:ring-blue-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label
              htmlFor={isEditing ? 'edit-priority' : 'priority'}
              className="text-sm font-semibold text-slate-700"
            >
              Priority
            </Label>
            <Select
              id={isEditing ? 'edit-priority' : 'priority'}
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              disabled={isLoading}
              className="h-10 border-slate-200 focus:border-blue-400 focus:ring-blue-100"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={isEditing ? 'edit-deadline' : 'deadline'}
              className="text-sm font-semibold text-slate-700"
            >
              Deadline
            </Label>
            <Input
              id={isEditing ? 'edit-deadline' : 'deadline'}
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              disabled={isLoading}
              className="h-10 border-slate-200 focus:border-blue-400 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {formError && (
        <Alert className="mt-5 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {formError}
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-7 flex gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed h-10 text-sm font-semibold flex items-center justify-center text-white transition-colors"
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
            className="flex-1 bg-slate-800 hover:bg-slate-900 h-10 text-sm font-semibold flex items-center justify-center text-white transition-colors"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
