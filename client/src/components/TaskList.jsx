import { TaskFilters } from './TaskFilters'
import { TaskCard } from './TaskCard'

export const TaskList = ({
  tasks,
  isLoading,
  filterStatus,
  setFilterStatus,
  stats,
  isEditing,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const filteredTasks =
    filterStatus === 'all'
      ? tasks
      : tasks.filter((task) => task.status === filterStatus)

  return (
    <div className="space-y-6">
      <TaskFilters
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        stats={stats}
      />
      {isLoading && tasks.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-600">
            {filterStatus === 'all'
              ? 'No tasks yet. Create one to get started!'
              : `No ${filterStatus} tasks.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isLoading={isLoading}
              isEditing={isEditing}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
