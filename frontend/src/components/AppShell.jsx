import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavLink = ({ to, label }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-full text-sm font-medium transition ${
        active
          ? 'bg-mint/20 text-mint border border-mint/40 shadow-inner shadow-mint/20'
          : 'text-sand hover:text-white hover:bg-white/5 border border-white/5'
      }`}
    >
      {label}
    </Link>
  );
};

const AppShell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen text-sand">
      <header className="sticky top-0 z-20 backdrop-blur bg-night/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-mint to-sky shadow-card" />
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-white flex items-center gap-2">
                roledash
                <span className="flex items-center gap-1 text-mint text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <Lock className="w-4 h-4" />
                  <Activity className="w-4 h-4" />
                </span>
              </p>
              <p className="text-xs text-white/70">Secure dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NavLink to="/dashboard" label="Dashboard" />
            <NavLink to="/profile" label="Profile" />
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm rounded-full bg-coral text-white font-semibold hover:bg-coral/80 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
