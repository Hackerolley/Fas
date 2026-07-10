// Small admin metric card for dashboard summaries.
const StatCard = ({ label, value, hint }) => (
  <div className="rounded-lg bg-white p-5 shadow-soft ring-1 ring-black/5">
    <p className="text-sm font-semibold text-ink/55">{label}</p>
    <p className="mt-2 text-3xl font-extrabold text-ink">{value}</p>
    <p className="mt-1 text-sm text-moss">{hint}</p>
  </div>
);

export default StatCard;
