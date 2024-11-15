import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import CertificateUploader from "./Components/Certificate Sender/CertificateSender";
import NavBar from "./Components/Layout/Navbar";
import Footer from "./Components/Layout/Footer";
import Home from "./Components/Home";
import Contact from "./Components/Contact";
import { Routes, Route } from "react-router-dom";
import CertificateSenderLanding from "./Components/Certificate Sender/CertificateSenderLanding";
import MassEmailSenderLanding from "./Components/Email Sender/EmailSenderLanding";
import MailSender from "./Components/Email Sender/MailSender";
const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/certificate-sender"
          element={<CertificateSenderLanding />}
        />
        <Route path="/mail-sender" element={<MassEmailSenderLanding />} />
        <Route path="/mass-email-sender/start" element={<MailSender />} />
        <Route
          path="/certificate-sender/start"
          element={<CertificateUploader />}
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
