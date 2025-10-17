export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back!</h1>
        <p className="text-gray-600 mt-2">Here's your fitness overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Current Streak</p>
              <p className="text-3xl font-bold text-blue-600">7 days</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Workouts This Week</p>
              <p className="text-3xl font-bold text-green-600">4/5</p>
            </div>
            <div className="text-4xl">💪</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Volume (kg)</p>
              <p className="text-3xl font-bold text-purple-600">1,250</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button className="p-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
            + Log Workout
          </button>
          <button className="p-4 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition">
            + Log Meal
          </button>
        </div>
      </div>

      {/* Today's Plan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Plan</h2>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-800">Push Day A</p>
            <p className="text-sm text-gray-600 mt-1">5 exercises • 60 min</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-800">Nutrition Goal</p>
            <p className="text-sm text-gray-600 mt-1">2,500 kcal • 180g protein</p>
          </div>
        </div>
      </div>
    </div>
  );
}
