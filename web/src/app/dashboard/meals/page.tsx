export default function Meals() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Meals</h1>
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
          + Log Meal
        </button>
      </div>

      {/* Daily Macros */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Macros</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Calories</p>
            <p className="text-2xl font-bold text-blue-600">1,850 / 2,500</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Protein</p>
            <p className="text-2xl font-bold text-red-600">120 / 180g</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">Carbs</p>
            <p className="text-2xl font-bold text-yellow-600">200 / 280g</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Fat</p>
            <p className="text-2xl font-bold text-purple-600">50 / 70g</p>
          </div>
        </div>
      </div>

      {/* Quick Add */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Add</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition text-left">
            <p className="font-semibold text-gray-800">🥗 Breakfast</p>
            <p className="text-sm text-gray-600 mt-1">Add your morning meal</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition text-left">
            <p className="font-semibold text-gray-800">🍔 Lunch</p>
            <p className="text-sm text-gray-600 mt-1">Add your lunch</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition text-left">
            <p className="font-semibold text-gray-800">🍕 Dinner</p>
            <p className="text-sm text-gray-600 mt-1">Add your dinner</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition text-left">
            <p className="font-semibold text-gray-800">🍎 Snack</p>
            <p className="text-sm text-gray-600 mt-1">Add a snack</p>
          </button>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Meals</h2>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">Breakfast - Oatmeal & Eggs</p>
              <p className="text-sm text-gray-600 mt-1">450 kcal • 30g protein • 45g carbs • 15g fat</p>
            </div>
            <button className="text-green-600 hover:underline">Edit</button>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">Lunch - Chicken Bowl</p>
              <p className="text-sm text-gray-600 mt-1">650 kcal • 50g protein • 70g carbs • 20g fat</p>
            </div>
            <button className="text-green-600 hover:underline">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
