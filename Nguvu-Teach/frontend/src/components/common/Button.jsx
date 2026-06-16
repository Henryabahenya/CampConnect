/**
 * Reusable Button component with variant support.
 *
 * Props:
 *  - children: Button label/content
 *  - variant: 'primary' | 'secondary' | 'outline' (default: 'primary')
 *  - size: 'sm' | 'md' | 'lg' (default: 'md')
 *  - href: If provided, renders as an anchor tag
 *  - className: Additional custom classes
 *  - ...rest: Any other native button/anchor props
 */

const variants = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
  secondary:
    "bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-400",
  outline:
    "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  ...rest
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

export default Button;
