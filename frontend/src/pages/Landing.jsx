import Navbar from "../components/common/Navbar";
import Hero from "../components/common/Hero";
import Features from "../components/common/Features";
import CTA from "../components/common/CTA";
import Footer from "../components/common/Footer";

function Landing() {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <CTA />
            <Footer />
        </>
    );
}

export default Landing;