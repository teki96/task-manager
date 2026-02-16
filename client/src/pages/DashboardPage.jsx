import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { TaskContext } from '../context/TaskContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select } from '../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'

export const DashboardPage = () => {
  const { user } = useContext(AuthContext)
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  } = useContext(TaskContext)

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
  })
  const [formError, setFormError] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
  })
  const [editFormError, setEditFormError] = useState('')

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitTask = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!formData.title.trim()) {
      setFormError('Task title is required')
      return
    }

    const result = await createTask({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      deadline: formData.deadline || null,
      status: 'todo',
    })

    if (result.success) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        deadline: '',
      })
      setShowForm(false)
      setFormError('')
    } else {
      setFormError(result.error)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    await updateTask(taskId, {
      ...task,
      status: newStatus,
    })
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId)
    }
  }

  const handleEditTask = (task) => {
    setEditingTaskId(task.id)
    setEditFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
    })
    setEditFormError('')
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitEditTask = async (e) => {
    e.preventDefault()
    setEditFormError('')

    if (!editFormData.title.trim()) {
      setEditFormError('Task title is required')
      return
    }

    const task = tasks.find((t) => t.id === editingTaskId)
    if (!task) return

    const result = await updateTask(editingTaskId, {
      ...task,
      title: editFormData.title,
      description: editFormData.description,
      priority: editFormData.priority,
      deadline: editFormData.deadline || null,
    })

    if (result.success) {
      setEditingTaskId(null)
      setEditFormData({
        title: '',
        description: '',
        priority: 'medium',
        deadline: '',
      })
      setEditFormError('')
    } else {
      setEditFormError(result.error)
    }
  }

  const handleCancelEdit = () => {
    setEditingTaskId(null)
    setEditFormData({
      title: '',
      description: '',
      priority: 'medium',
      deadline: '',
    })
    setEditFormError('')
  }

  const filteredTasks =
    filterStatus === 'all'
      ? tasks
      : tasks.filter((task) => task.status === filterStatus)

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }

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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'done':
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

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.username}! 👋
          </h1>
          <p className="mt-2 text-gray-600">Manage your tasks efficiently</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
            <Alert className="border-0 bg-transparent p-0">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
            <button
              className="text-red-600 hover:text-red-700"
              onClick={clearError}
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {stats.done}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {stats.inProgress}
                </p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-600">{stats.todo}</p>
                <p className="text-sm text-gray-600">To Do</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>📋 My Tasks</CardTitle>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {showForm ? '✕ Cancel' : '+ Add Task'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Task Form */}
            {showForm && (
              <form
                className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6"
                onSubmit={handleSubmitTask}
              >
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter task description"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      id="priority"
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
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Task'}
                </Button>
              </form>
            )}

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFilterStatus('all')}
              >
                All ({stats.total})
              </button>
              <button
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'todo'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFilterStatus('todo')}
              >
                To Do ({stats.todo})
              </button>
              <button
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'in-progress'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFilterStatus('in-progress')}
              >
                In Progress ({stats.inProgress})
              </button>
              <button
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'done'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFilterStatus('done')}
              >
                Done ({stats.done})
              </button>
            </div>

            {/* Edit Task Modal */}
            {editingTaskId && (
              <form
                className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-6"
                onSubmit={handleSubmitEditTask}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Edit Task
                  </h3>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Task Title *</Label>
                    <Input
                      id="edit-title"
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditInputChange}
                      placeholder="Enter task title"
                      disabled={isLoading}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    placeholder="Enter task description"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select
                      id="edit-priority"
                      name="priority"
                      value={editFormData.priority}
                      onChange={handleEditInputChange}
                      disabled={isLoading}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-deadline">Deadline</Label>
                    <Input
                      id="edit-deadline"
                      type="date"
                      name="deadline"
                      value={editFormData.deadline}
                      onChange={handleEditInputChange}
                      disabled={isLoading}
                      className="h-10"
                    />
                  </div>
                </div>

                {editFormError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {editFormError}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                    className="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Tasks List */}
            {isLoading && tasks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-600">Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-600">
                  {filterStatus === 'all'
                    ? 'No tasks yet. Create one to get started! 🚀'
                    : `No ${filterStatus} tasks.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow"
                  >
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
                          onChange={(e) =>
                            handleStatusChange(task.id, e.target.value)
                          }
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
                        onClick={() => handleEditTask(task)}
                        disabled={isLoading || editingTaskId !== null}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={isLoading || editingTaskId !== null}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50"
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
