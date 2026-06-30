function Card({ children, className = "" }) {
    return (
        <div
            className={`
bg-slate-900
border
border-slate-800
rounded-2xl
p-8
transition-all
duration-300
hover:-translate-y-2
hover:border-blue-500
hover:shadow-2xl
hover:shadow-blue-500/10
${className}
`}
        >
            {children}
        </div>
    );
}

export default Card;