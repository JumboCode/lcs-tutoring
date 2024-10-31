"use client";

import Header from "./header.tsx";
import Footer from "./Footer.tsx";
import Intro from "./intro.tsx";
import ServicesBoxes from "./services.tsx";
import AboutUs from "./aboutUs.tsx";
import GetInvolved from "./getInvolved.tsx";
import PastTutors from "./pastTutors.tsx";


const HomePage = () => {
    return (
        <div>
            <div className="sticky top-0 relative z-50"><Header/></div>
            <Intro/>
            <AboutUs/>
            <ServicesBoxes/>
            <GetInvolved/>
            <PastTutors/>
            <Footer/>
        </div>
    );
};

export default HomePage;
