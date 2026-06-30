import { Link } from "react-router-dom";

function Button({
    children,
    to,
    onClick,
    type = "button",
    variant = "primary",
    className = ""
}) {

    const baseStyle =
        "inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300";

    const variants = {
        primary:
            "bg-blue-600 hover:bg-blue-700 text-white",

        secondary:
            "border border-slate-700 text-white hover:bg-slate-800",

        danger:
            "bg-red-600 hover:bg-red-700 text-white"
    };

    if (to) {
        return (
            <Link
                to={to}
                className={`${baseStyle} ${variants[variant]} ${className}`}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;