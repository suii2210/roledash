const FormField = ({ label, error, children }) => (
  <label className="flex flex-col gap-2 text-sm text-white/80">
    <span className="font-semibold text-white">{label}</span>
    {children}
    {error ? <span className="text-xs text-coral">{error}</span> : null}
  </label>
);

export default FormField;

