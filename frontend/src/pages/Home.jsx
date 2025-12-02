import { Link } from 'react-router-dom';

const Home = () => (
  <div className="min-h-screen flex items-center justify-center px-4 py-12">
    <div className="max-w-3xl w-full text-center bg-white/5 border border-white/10 rounded-3xl p-10 shadow-card">
      <p className="text-sm text-white/60">roledash</p>
      <h1 className="text-4xl font-bold text-white mt-3 mb-4">Hi! Welcome to your workspace.</h1>
      <p className="text-lg text-white/70 mb-8">
        Jump into the dashboard to manage tasks, or sign in to continue where you left off.
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        <Link
          to="/dashboard"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-mint to-sky text-night font-semibold hover:opacity-90"
        >
          Go to dashboard
        </Link>
        <Link
          to="/login"
          className="px-5 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-5 py-3 rounded-xl border border-mint/40 text-mint hover:bg-mint/10"
        >
          Register
        </Link>
      </div>
    </div>
  </div>
);

export default Home;
