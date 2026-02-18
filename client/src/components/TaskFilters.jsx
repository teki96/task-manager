import { ListTodo, CheckCircle2, Clock, Filter } from 'lucide-react'

export const TaskFilters = ({ filterStatus, setFilterStatus, stats }) => {
  const filters = [
    { status: 'all', label: 'All', count: stats.total, icon: ListTodo },
    { status: 'todo', label: 'To Do', count: stats.todo, icon: Filter },
    {
      status: 'in-progress',
      label: 'In Progress',
      count: stats.inProgress,
      icon: Clock,
    },
    { status: 'done', label: 'Done', count: stats.done, icon: CheckCircle2 },
  ]

  return (
    <div className="flex flex-wrap gap-2 pb-2">
      {filters.map((filter) => {
        const Icon = filter.icon
        return (
          <button
            key={filter.status}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
              filterStatus === filter.status
                ? 'bg-blue-600 text-white shadow-md'
                : 'border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
            onClick={() => setFilterStatus(filter.status)}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{filter.label}</span>
            <span className="text-xs opacity-75 ml-0.5">({filter.count})</span>
          </button>
        )
      })}
    </div>
  )
}
