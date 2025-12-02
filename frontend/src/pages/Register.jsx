import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', bio: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name || form.name.length < 2) return setError('Name must be at least 2 characters');
    if (!form.email.includes('@')) return setError('A valid email is required');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join the dashboard experience"
      footer={
        <p>
          Already registered?{' '}
          <Link to="/login" className="text-mint font-semibold">
            Login
          </Link>
        </p>
      }
    >
      {error ? (
        <div className="p-3 rounded-xl bg-coral/20 text-coral border border-coral/30">{error}</div>
      ) : null}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Full name" error={!form.name ? 'Required' : ''}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
            placeholder="Alex Kim"
            required
          />
        </FormField>
        <FormField label="Email" error={!form.email ? 'Required' : ''}>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
            placeholder="you@company.com"
            required
          />
        </FormField>
        <FormField label="Password" error={!form.password ? 'Required' : ''}>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-mint pr-14"
              placeholder="••••••••"
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
        <FormField label="Bio (optional)">
          <textarea
            name="bio"
            rows="3"
            value={form.bio}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
            placeholder="What do you want to accomplish?"
          />
        </FormField>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-mint to-sky text-night font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
