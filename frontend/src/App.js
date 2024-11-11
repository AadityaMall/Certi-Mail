import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import CertificateUploader from "./Components/Certificate Sender/CertificateSender";
import NavBar from "./Components/Layout/Navbar";
import Home from "./Components/Home";
import { Routes, Route } from "react-router-dom";
import CertificateSenderLanding from "./Components/Certificate Sender/CertificateSenderLanding";
const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Home />} />
        <Route path="/login" element={<Home />} />
        <Route
          path="/certificate-sender"
          element={<CertificateSenderLanding />}
        />
        <Route
          path="/certificate-sender/start"
          element={<CertificateUploader />}
        />
      </Routes>
    </>
  );
};

export default App;
