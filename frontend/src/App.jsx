import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const Home = lazy(() => import("./pages/home/Home"))
import "./App.css";
const Navbar = lazy(() => import("./components/layout/Header"));

// import Footer from "./components/layout/Footer";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/applyNow" element={<Home />} />
      </Routes>

      {/* <Footer /> */}
    </>
  );
}

export default App;
