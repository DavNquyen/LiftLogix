export default function History() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">History</h1>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Workouts</p>
          <p className="text-3xl font-bold text-blue-600">42</p>
          <p className="text-sm text-gray-600 mt-2">Last 30 days</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Volume</p>
          <p className="text-3xl font-bold text-green-600">48,500 kg</p>
          <p className="text-sm text-gray-600 mt-2">All time</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Best Streak</p>
          <p className="text-3xl font-bold text-purple-600">14 days</p>
          <p className="text-sm text-gray-600 mt-2">Personal record</p>
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Chart</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart visualization coming soon</p>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Activity Timeline</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-16 text-sm text-gray-500">Today</div>
            <div className="flex-1">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-gray-800">Completed Push Day A</p>
                <p className="text-sm text-gray-600 mt-1">5 exercises • 1,250 kg volume</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-16 text-sm text-gray-500">Yesterday</div>
            <div className="flex-1 space-y-3">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="font-semibold text-gray-800">Logged 3 meals</p>
                <p className="text-sm text-gray-600 mt-1">2,450 kcal • 175g protein</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-16 text-sm text-gray-500">2 days ago</div>
            <div className="flex-1">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-gray-800">Completed Leg Day</p>
                <p className="text-sm text-gray-600 mt-1">6 exercises • 1,800 kg volume</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
