import { useContext, useState, useEffect } from 'react'
import { X, ClipboardList, Plus } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { TaskContext } from '../context/TaskContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { TaskStats } from '../components/TaskStats'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'
import { WelcomeBanner } from '../components/WelcomeBanner'

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
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingTaskId, setEditingTaskId] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleCreateTask = async (formData) => {
    const result = await createTask({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      deadline: formData.deadline || null,
      status: 'todo',
    })

    if (result.success) {
      setShowForm(false)
    }

    return result
  }

  const handleUpdateTask = async (formData) => {
    const task = tasks.find((t) => t.id === editingTaskId)
    if (!task) return { success: false, error: 'Task not found' }

    const result = await updateTask(editingTaskId, {
      ...task,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      deadline: formData.deadline || null,
    })

    if (result.success) {
      setEditingTaskId(null)
    }

    return result
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
  }

  const handleCancelEdit = () => {
    setEditingTaskId(null)
  }

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }

  const editingTask = editingTaskId
    ? tasks.find((t) => t.id === editingTaskId)
    : null

  const editInitialData = editingTask
    ? {
        title: editingTask.title,
        description: editingTask.description || '',
        priority: editingTask.priority,
        deadline: editingTask.deadline
          ? editingTask.deadline.split('T')[0]
          : '',
      }
    : null

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <WelcomeBanner username={user.name?.trim() || user.username} />
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
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <TaskStats stats={stats} />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              My Tasks
            </CardTitle>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-slate-800 hover:bg-slate-900 h-8 text-sm flex items-center justify-center text-white"
            >
              {showForm ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Task
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {showForm && (
              <TaskForm isLoading={isLoading} onSubmit={handleCreateTask} />
            )}
            {editingTaskId && editInitialData && (
              <TaskForm
                isLoading={isLoading}
                onSubmit={handleUpdateTask}
                initialData={editInitialData}
                onCancel={handleCancelEdit}
                isEditing={true}
              />
            )}
            <TaskList
              tasks={tasks}
              isLoading={isLoading}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              stats={stats}
              isEditing={editingTaskId !== null}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
