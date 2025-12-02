import { useState } from 'react';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../services/api';

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    portfolio: user?.portfolio || '',
    contactEmail: user?.contactEmail || user?.email || ''
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    next: false,
    confirm: false
  });
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await profileApi.update(form);
      await refreshProfile();
      setMessage('Profile updated');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('Passwords do not match.');
      return;
    }
    if (passwordForm.newPassword === passwordForm.currentPassword) {
      setPasswordMessage('New password must be different from current.');
      return;
    }
    setPasswordLoading(true);
    try {
      await profileApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordMessage('Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMessage(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-card">
        <h3 className="text-white font-semibold text-xl mb-3">Profile</h3>
        <p className="text-white/70 text-sm mb-5">
          Update your visible details. Server-side validation is enforced to keep data healthy.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormField label="Name">
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-3 rounded-xl bg-night border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
              required
            />
          </FormField>
          <FormField label="Bio">
            <textarea
              rows="4"
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              className="w-full px-3 py-3 rounded-xl bg-night border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
              placeholder="What are you focused on?"
            />
          </FormField>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField label="GitHub URL">
              <input
                value={form.github}
                onChange={(e) => setForm((p) => ({ ...p, github: e.target.value }))}
                className="w-full px-3 py-3 rounded-xl bg-night border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
                placeholder="https://github.com/your-handle"
              />
            </FormField>
            <FormField label="LinkedIn URL">
              <input
                value={form.linkedin}
                onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))}
                className="w-full px-3 py-3 rounded-xl bg-night border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
                placeholder="https://linkedin.com/in/your-handle"
              />
            </FormField>
            <FormField label="Portfolio URL">
              <input
                value={form.portfolio}
                onChange={(e) => setForm((p) => ({ ...p, portfolio: e.target.value }))}
                className="w-full px-3 py-3 rounded-xl bg-night border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
                placeholder="https://your-portfolio.com"
              />
            </FormField>
            <FormField label="Contact email (for reach-out)">
              <input
                value={form.contactEmail}
                onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
                className="w-full px-3 py-3 rounded-xl bg-night border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
                placeholder="reachyou@example.com"
              />
            </FormField>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-mint to-sky text-night font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
          {message ? <p className="text-sm text-white/70">{message}</p> : null}
        </form>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-card">
        <h3 className="text-white font-semibold text-xl mb-4">Account metadata</h3>
        <div className="space-y-3 text-white/80">
          <p>
            <span className="text-white/50">Email: </span>
            {user?.email}
          </p>
          <p>
            <span className="text-white/50">Created: </span>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : 'When you registered'}
          </p>
          <p className="text-sm text-white/60">
            Passwords are hashed with bcrypt on the server and never leave your browser in plain
            text.
          </p>
        </div>
      </div>
      <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-card">
        <h3 className="text-white font-semibold text-xl mb-3">Security</h3>
        <p className="text-white/70 text-sm mb-5">
          Change your password. This requires your current password and enforces server validation.
        </p>
        <form className="grid md:grid-cols-3 gap-4 items-end" onSubmit={handlePasswordSubmit}>
          <FormField label="Current password">
            <div className="relative">
              <input
                type={passwordVisibility.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                }
                className="w-full px-3 py-3 rounded-xl bg-night border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint pr-14"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setPasswordVisibility((p) => ({ ...p, current: !p.current }))
                }
                className="absolute inset-y-0 right-3 text-white/70 hover:text-white text-sm"
              >
                {passwordVisibility.current ? 'Hide' : 'Show'}
              </button>
            </div>
          </FormField>
          <FormField label="New password">
            <div className="relative">
              <input
                type={passwordVisibility.next ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                className="w-full px-3 py-3 rounded-xl bg-night border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint pr-14"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisibility((p) => ({ ...p, next: !p.next }))}
                className="absolute inset-y-0 right-3 text-white/70 hover:text-white text-sm"
              >
                {passwordVisibility.next ? 'Hide' : 'Show'}
              </button>
            </div>
          </FormField>
          <FormField label="Confirm new password">
            <div className="relative">
              <input
                type={passwordVisibility.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                }
                className="w-full px-3 py-3 rounded-xl bg-night border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint pr-14"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setPasswordVisibility((p) => ({ ...p, confirm: !p.confirm }))
                }
                className="absolute inset-y-0 right-3 text-white/70 hover:text-white text-sm"
              >
                {passwordVisibility.confirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </FormField>
          <div className="md:col-span-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-coral to-sky text-night font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {passwordLoading ? 'Updating...' : 'Update password'}
            </button>
            {passwordMessage ? (
              <span className="text-sm text-white/80">{passwordMessage}</span>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
