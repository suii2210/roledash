import { Link } from 'react-router-dom';

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen flex items-center justify-center px-4 py-10">
    <div className="relative max-w-xl w-full">
      <div className="bg-white/5 border border-white/10 backdrop-blur rounded-3xl p-8 shadow-card">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-sm text-white/60">roledash</p>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-white/70">{subtitle}</p>
          </div>
          <Link
            to="/"
            className="text-sm text-mint font-semibold border border-mint/40 px-3 py-1 rounded-full hover:bg-mint/10"
          >
            Home
          </Link>
        </div>
        <div className="mt-6 space-y-6">{children}</div>
        {footer ? <div className="mt-6 text-sm text-white/70">{footer}</div> : null}
      </div>
    </div>
  </div>
);

export default AuthLayout;
