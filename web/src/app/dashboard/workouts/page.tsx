export default function Workouts() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Workouts</h1>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
          + New Workout
        </button>
      </div>

      {/* Workout Template Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Start a Workout</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-left">
            <p className="font-semibold text-gray-800">Push Day</p>
            <p className="text-sm text-gray-600 mt-1">Chest, Shoulders, Triceps</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-left">
            <p className="font-semibold text-gray-800">Pull Day</p>
            <p className="text-sm text-gray-600 mt-1">Back, Biceps</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-left">
            <p className="font-semibold text-gray-800">Leg Day</p>
            <p className="text-sm text-gray-600 mt-1">Quads, Hamstrings, Glutes</p>
          </button>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Workouts</h2>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">Push Day A</p>
              <p className="text-sm text-gray-600 mt-1">Yesterday • 5 exercises • 45 min</p>
            </div>
            <button className="text-blue-600 hover:underline">View</button>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">Leg Day</p>
              <p className="text-sm text-gray-600 mt-1">3 days ago • 6 exercises • 60 min</p>
            </div>
            <button className="text-blue-600 hover:underline">View</button>
          </div>
        </div>
      </div>
    </div>
  );
}
