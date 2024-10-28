"use client";

import Header from "./header.tsx";
import Footer from "./Footer.tsx";
import Intro from "./intro.tsx";
import ServicesBoxes from "./services.tsx";
import AboutUs from "./aboutUs.tsx";


const HomePage = () => {
    return (
        <div>
            <div className="sticky top-0"><Header/></div>
            <Intro/>
            <AboutUs/>
            <ServicesBoxes/>
            <Footer/>
        </div>
    );
};

export default HomePage;
