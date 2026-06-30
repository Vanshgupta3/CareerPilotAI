import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import CTA from "../components/landing/CTA";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import WhyChoose from "../components/landing/WhyChoose";
import PlatformModules from "../components/landing/PlatformModules";

function Landing() {
    return (
        <>
    <Navbar />
    <Hero />
    <WhyChoose />
     {/* <HowItWorks /> */}
    <PlatformModules />
    <CTA />
    <Footer />
</>
    );
}

export default Landing;