import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tight text-white">
            LIFT<span className="text-blue-500">LOGIX</span>
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 text-zinc-300 font-bold hover:text-white transition-colors"
            >
              LOGIN
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-blue-600 text-white font-black hover:bg-blue-500 transition-all duration-200 border-2 border-blue-600 hover:border-blue-400"
            >
              START FREE
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24 md:py-40">
        <div className="max-w-5xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 bg-zinc-900 border border-blue-600 text-blue-500 font-black text-sm tracking-wider">
            NO EXCUSES. NO COMPROMISES.
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none text-white">
            TRACK YOUR
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">PROGRESS.</span>
            <br />
            BUILD RESULTS.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 leading-relaxed max-w-3xl font-medium">
            Stop guessing. Start tracking. Log every set, every rep, every pound.
            Built for lifters who are serious about gains.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="px-10 py-5 bg-blue-600 text-white font-black text-lg hover:bg-blue-500 transition-all duration-200 border-2 border-blue-600 hover:border-blue-400 text-center"
            >
              GET STARTED →
            </Link>
            <Link
              href="/login"
              className="px-10 py-5 bg-transparent border-2 border-orange-600 text-orange-500 font-black text-lg hover:border-orange-500 hover:bg-orange-600 hover:text-white transition-all duration-200 text-center"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="border-y border-zinc-800 bg-zinc-900/50 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-black text-blue-500 mb-2">38+</div>
              <div className="text-zinc-400 font-bold tracking-wide">EXERCISES</div>
            </div>
            <div>
              <div className="text-5xl font-black text-orange-500 mb-2">∞</div>
              <div className="text-zinc-400 font-bold tracking-wide">TRACKING</div>
            </div>
            <div>
              <div className="text-5xl font-black text-blue-500 mb-2">100%</div>
              <div className="text-zinc-400 font-bold tracking-wide">FREE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            BUILT FOR LIFTERS
          </h2>
          <p className="text-xl text-zinc-400 font-medium">
            Everything you need. Nothing you don't.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 p-8 border-2 border-zinc-800 hover:border-blue-600 transition-all duration-300">
            <div className="w-16 h-16 bg-blue-600 flex items-center justify-center text-3xl mb-6 font-black text-white">
              💪
            </div>
            <h3 className="text-2xl font-black text-white mb-4">TRACK EVERYTHING</h3>
            <p className="text-zinc-400 leading-relaxed font-medium">
              Log weight, reps, and RPE for every set. See exactly what you lifted and when.
            </p>
          </div>
          <div className="bg-zinc-900 p-8 border-2 border-zinc-800 hover:border-orange-600 transition-all duration-300">
            <div className="w-16 h-16 bg-orange-600 flex items-center justify-center text-3xl mb-6 font-black text-white">
              📈
            </div>
            <h3 className="text-2xl font-black text-white mb-4">MEASURE PROGRESS</h3>
            <p className="text-zinc-400 leading-relaxed font-medium">
              Track volume, streaks, and PRs. Watch the numbers go up over time.
            </p>
          </div>
          <div className="bg-zinc-900 p-8 border-2 border-zinc-800 hover:border-blue-600 transition-all duration-300">
            <div className="w-16 h-16 bg-blue-600 flex items-center justify-center text-3xl mb-6 font-black text-white">
              🔥
            </div>
            <h3 className="text-2xl font-black text-white mb-4">STAY CONSISTENT</h3>
            <p className="text-zinc-400 leading-relaxed font-medium">
              Build streaks. Show up every day. Consistency beats intensity.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-orange-600 p-12 md:p-20 text-center border-4 border-blue-500">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            READY TO LIFT?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-bold">
            Start tracking today. Free forever. No credit card required.
          </p>
          <Link
            href="/register"
            className="inline-block px-12 py-5 bg-black text-white font-black text-lg hover:bg-zinc-900 transition-all duration-200 border-2 border-black hover:scale-105"
          >
            CREATE ACCOUNT →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10 bg-zinc-900">
        <div className="container mx-auto px-6 text-center text-zinc-500">
          <p className="font-bold">© 2025 LIFTLOGIX. BUILT FOR CS 4624.</p>
        </div>
      </footer>
    </div>
  );
}
