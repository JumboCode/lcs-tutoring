"use client";

import Intro from "./intro.tsx";
import ServicesBoxes from "./services.tsx";
import AboutUs from "./aboutUs.tsx";
import GetInvolved from "./getInvolved.tsx";
import PastTutors from "./pastTutors.tsx";
import EListForm from "./E-ListForm.tsx";

const HomePage = () => {
  return (
    <div>
      <Intro />
      <AboutUs />
      <ServicesBoxes />
      <GetInvolved />
      <PastTutors />
      <EListForm />
    </div>
  );
};

export default HomePage;
