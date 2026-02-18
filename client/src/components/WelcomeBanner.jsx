export const WelcomeBanner = ({ username }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900">
      Welcome, {username}! 👋
    </h1>
    <p className="mt-2 text-gray-600">Manage your tasks efficiently</p>
  </div>
)
