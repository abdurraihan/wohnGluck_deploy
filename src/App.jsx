import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Components/Header.jsx";
import PrivateRouter from "./Components/PrivateRouter.jsx";
import About from "./pages/About.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import Home from "./pages/Home.jsx";
import Listing from "./pages/Listing.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/Profile.jsx";
import Search from "./pages/Search.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignOut from "./pages/SignOut.jsx";
import SignUp from "./pages/SignUp.jsx";
import UpdateListing from "./pages/UpdateListing.jsx";

function App() {
  return (
    <div>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-out" element={<SignOut />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />

        <Route element={<PrivateRouter />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
export default App;
