import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    try {
      await login(form);
      const next = location.state?.from?.pathname || '/dashboard';
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your dashboard"
      footer={
        <p>
          Need an account?{' '}
          <Link to="/register" className="text-mint font-semibold">
            Create one
          </Link>
        </p>
      }
    >
      {error ? (
        <div className="p-3 rounded-xl bg-coral/20 text-coral border border-coral/30">{error}</div>
      ) : null}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Email" error={!form.email ? 'Required' : ''}>
          <input
            name="email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
            required
          />
        </FormField>
        <FormField label="Password" error={!form.password ? 'Required' : ''}>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-mint pr-14"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 text-white/70 hover:text-white text-sm"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </FormField>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-mint to-sky text-night font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
