
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LcsTutoringIntro from "./components/intro";
import Header from './components/header'; 
import ServicesBoxes from "./components/services";
// import BrandonButton from "@/components/buttonBrandon";
// import SethRachelButton from "./components/buttonSethRachel";
// import ValentinaCharlieButton from "./components/buttonValentinaCharlie";
// import AnneRainierButton from "@/components/buttonAnneRainier";
// import ArayHunterButton from "./components/buttonArayHunter";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<div></div>}></Route>

//         <Route
//           path="/testbuttons"
//           element={
//             <div>
//               {/* <BrandonButton /> */}
//               {/* <SethRachelButton /> */}
//               {/* <ValentinaCharlieButton /> */}
//               {/* <AnneRainierButton /> */}
//               {/* <ArayHunterButton /> */}
//             </div>
//           }
//         ></Route>

//         {/* New route to display the next component! */}
//         <Route
//           path="/intro" // TODO: Change the path name to match that of your component
//           element={<div>{<LcsTutoringIntro/>}</div>} //{<div>{/* TODO: Include your component here: */}</div>}
//         ></Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LcsTutoringIntro from "./components/intro";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect to /intro */}
        <Route path="/" element={<Navigate to="/intro" />} />

        <Route
          path="/header"
          element=
          {<div>
                <Header/>
          </div>}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;