// Shared button keeps calls-to-action visually consistent across the app.
const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) => {
  const variants = {
    primary:
      "bg-ink text-white hover:bg-clay",

    secondary:
      "bg-white text-ink ring-1 ring-linen hover:bg-pearl",

    ghost:
      "bg-transparent text-ink hover:bg-linen",

    success:
      "bg-green-600 text-white hover:bg-green-700",

    warning:
      "bg-amber-500 text-white hover:bg-amber-600",

    danger:
      "bg-red-600 text-white hover:bg-red-700"
  };

  const sizes = {
    sm: "min-h-9 px-3 py-1.5 text-xs rounded-lg",

    md: "min-h-11 px-5 py-2 text-sm rounded-full",

    lg: "min-h-12 px-7 py-3 text-base rounded-full"
  };

  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        font-semibold
        transition
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;