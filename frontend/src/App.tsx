import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

/* General View */
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./components/homePage";
import TutorForm from "./components/TutorForm";
import TuteeForm from "./components/TuteeForm";
import TeamPage from "./components/teamPage";
import Header from "./components/header";
import Footer from "./components/Footer";

/* Admin View */
import NavigationBar from "./components/navigationBar";
import AdminLogin from "./components/adminSignIn";
import SuccessPage from "./components/SuccessPage";
import EListForm from "./components/E-ListForm";

import { SignedIn, SignedOut } from "@clerk/react-router";
import elephantLogo from "./assets/images/elephant.svg";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: elephantLogo,
        },
      }}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/admin"
      signInUrl="/admin"
    >
      <Router>
        <Routes>
          {/* Client View */}
          <Route
            path="/"
            element={
              <div className="flex flex-col">
                <ScrollToTop />
                <Header />
                <HomePage />
                <Footer />
              </div>
            }
          ></Route>
          <Route
            path="/team"
            element={
              <div className="flex flex-col">
                <ScrollToTop />
                <Header />
                <TeamPage />
                <EListForm />
                <Footer />
              </div>
            }
          ></Route>
          <Route
            path="/tutor-form"
            element={
              <div className="flex flex-col">
                <ScrollToTop />
                <Header />
                <TutorForm />
                <Footer />
              </div>
            }
          ></Route>
          <Route
            path="/tutee-form"
            element={
              <div className="flex flex-col">
                <ScrollToTop />
                <Header />
                <TuteeForm />
                <Footer />
              </div>
            }
          ></Route>

          <Route
            path="/success-page"
            element={
              <div className="flex flex-col">
                <ScrollToTop />
                <Header />
                <SuccessPage />
                <Footer />
              </div>
            }
          ></Route>

          <Route
            path="/admin"
            element={
              <div>
                <SignedOut>
                  <AdminLogin />
                </SignedOut>
                <SignedIn>
                  <NavigationBar />
                </SignedIn>
              </div>
            }
          ></Route>
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
