export const TaskFilters = ({ filterStatus, setFilterStatus, stats }) => {
  const filters = [
    { status: 'all', label: 'All', count: stats.total },
    { status: 'todo', label: 'To Do', count: stats.todo },
    { status: 'in-progress', label: 'In Progress', count: stats.inProgress },
    { status: 'done', label: 'Done', count: stats.done },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.status}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filterStatus === filter.status
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setFilterStatus(filter.status)}
        >
          {filter.label} ({filter.count})
        </button>
      ))}
    </div>
  )
}
