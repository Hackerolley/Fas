// Shared button keeps calls-to-action visually consistent across the app.
const Button = ({ children, className = "", variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-ink text-white hover:bg-clay",
    secondary: "bg-white text-ink ring-1 ring-linen hover:bg-pearl",
    ghost: "bg-transparent text-ink hover:bg-linen"
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
