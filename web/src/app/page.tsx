import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">LiftLogix</h1>
        <div className="space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 text-white hover:text-gray-200 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center text-white">
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          Train smarter, eat better, stay consistent.
        </h2>
        <p className="text-xl md:text-2xl mb-12 text-gray-100 max-w-3xl mx-auto">
          LiftLogix helps college students plan workouts, track meals, and stay
          accountable with friends. Fast logging, smart defaults, and weekly insights.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
          >
            Get Started Free
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition"
          >
            View Demo
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-white">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">⚡ Fast Logging</h3>
            <p className="text-gray-100">
              Log workouts in under 20 seconds with smart prefills and quick-add features.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">📊 Smart Plans</h3>
            <p className="text-gray-100">
              Starter templates for beginners and intermediate lifters with auto-progression.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">🤝 Social Accountability</h3>
            <p className="text-gray-100">
              Stay motivated with friend check-ins, streaks, and group challenges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
