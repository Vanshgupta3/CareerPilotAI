function Section({
    children,
    className = ""
}) {
    return (
        <section
            className={`py-24 ${className}`}
        >
            {children}
        </section>
    );
}

export default Section;