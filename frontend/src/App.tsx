import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BrandonButton from "@/components/brandon_button";
import FirstComponent from "@/components/firstComponent";
import SethRachelButton from "./components/seth_rachel_button";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <FirstComponent />
            </div>
          }
        ></Route>

        <Route
          path="/testbuttons"
          element={
            <div>
              <BrandonButton />
              {/* <SethRachelButton /> */}
            </div>
          }
        ></Route>

        {/* New route to display the next component! */}
        <Route
          path="/[new name]" // TODO: Change the path name to match that of your component
          element={<div>{/* TODO: Include your component here: */}</div>}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
