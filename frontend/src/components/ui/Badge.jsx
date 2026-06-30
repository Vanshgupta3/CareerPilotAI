function Badge({ children }) {
    return (
        <span className="
            inline-block
            bg-blue-600/20
            text-blue-400
            px-3
            py-1
            rounded-full
            text-sm
            font-medium
        ">
            {children}
        </span>
    );
}

export default Badge;