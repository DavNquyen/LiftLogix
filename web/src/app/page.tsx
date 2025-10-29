import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            LiftLogix
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 text-slate-700 font-medium hover:text-slate-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
            Train Smarter, Not Harder
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Your Personal
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Fitness Coach</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Track workouts, log meals, and stay accountable with friends.
            Built for college students who want results without the hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
            >
              Get Started Free →
            </Link>
            <Link
              href="/login"
              className="px-10 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-bold text-lg hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-lg text-slate-600">
            Simple, powerful tools to help you reach your fitness goals
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-200">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl mb-4">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
            <p className="text-slate-600 leading-relaxed">
              Log your workouts in under 20 seconds. Smart prefills remember your last weights and reps.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-200">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl mb-4">
              📊
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Plans</h3>
            <p className="text-slate-600 leading-relaxed">
              Proven workout programs with automatic progression. Perfect for beginners and intermediate lifters.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-200">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl mb-4">
              🤝
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Stay Accountable</h3>
            <p className="text-slate-600 leading-relaxed">
              Connect with friends, track streaks, and join challenges. Fitness is better together.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students transforming their fitness routine
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            Create Free Account →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="container mx-auto px-6 text-center text-slate-600">
          <p>© 2025 LiftLogix. Built for CS 4624.</p>
        </div>
      </footer>
    </div>
  );
}
