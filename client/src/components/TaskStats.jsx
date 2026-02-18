import { Card, CardContent } from './ui/card'

export const TaskStats = ({ stats }) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.done}</p>
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
  )
}
