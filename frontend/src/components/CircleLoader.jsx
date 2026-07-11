// Reusable accessible spinner for buttons, forms, and page-level loading states.
const CircleLoader = ({ className = "", label = "Loading" }) => (
  <span className={`inline-flex items-center justify-center ${className}`} role="status" aria-label={label}>
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
  </span>
);

export default CircleLoader;
