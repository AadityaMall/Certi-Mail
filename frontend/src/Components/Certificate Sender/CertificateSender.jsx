import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Container } from "react-bootstrap";

import {
  authenticateEmail,
  clearErrors,
  resetReducers,
  sendCertificates,
} from "../../Redux/action";

import CertificateCustomizer from "./CertificateCustomizer";
import EmailAndDataSetup from "./EmailAndDataSetup";
import ResultsDisplay from "./ResultsDisplay";
import FileUpload from "./FileUpload";
import Loader from "../Layout/Loader";

const CertificateGenerator = () => {
  const dispatch = useDispatch();

  const [templateFile, setTemplateFile] = useState(null);
  const [fontFile, setFontFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [csvStage, setCsvStage] = useState(false);
  const [textElements, setTextElements] = useState([
    {
      id: Date.now(),
      text: "John Doe",
      fontSize: 30,
      xCoord: 50,
      yCoord: 50,
      color: { r: 0, g: 0, b: 0 },
      columnName: "Name",
    },
  ]);
  const [subject, setSubject] = useState("Your Certificate is Here!");
  const [body, setBody] = useState(
    "<p>Dear [Name],</p><p>Please find your certificate attached.</p><p>Best regards.</p>"
  );
  const [finaluserEmail, setFinalUserEmail] = useState(null);
  const [finaluserAppPassword, setFinalUserAppPassword] = useState(null);

  const { error, responseTable, loading } = useSelector(
    (state) => state.mailStatus
  );
  const {
    error: validationError,
    success,
    loading: validationLoading,
  } = useSelector((state) => state.authenticateUser);

  const sendCertificateHandler = async () => {
    if (!csvFile || !templateFile) {
      toast.error("Please upload both the template and the CSV file.");
      return;
    }
    const formData = new FormData();
    formData.append("excelFile", csvFile);
    formData.append("templateFile", templateFile);
    if (fontFile) {
      formData.append("fontFile", fontFile);
    }
    formData.append("textElements", JSON.stringify(textElements));
    formData.append("subject", subject);
    formData.append("body", body);

    if (finaluserEmail && finaluserAppPassword) {
      formData.append("userEmail", finaluserEmail);
      formData.append("appPassword", finaluserAppPassword);
    }
    dispatch(sendCertificates(formData));
  };

  const handleUserEmailVerification = (email, appPassword) => {
    if (!email || !appPassword) {
      toast.error("Please enter valid details");
      return;
    }
    if (appPassword.replace(/\s/g, "").length !== 16) {
      toast.error("Please enter a 16-character app password");
      return;
    }
    const formData = { email, appPassword };
    dispatch(authenticateEmail(formData));
  };

  useEffect(() => {
    if (success) {
      toast.success("User Validated Successfully!");
    }
  }, [success]);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (validationError) {
      toast.error(validationError);
      dispatch(clearErrors());
    }
  }, [error, validationError, dispatch]);

  useEffect(() => {
    if (!templateFile) {
      dispatch(resetReducers());
    }
  }, [templateFile, dispatch]);

  if (loading) return <Loader />;

  return (
    <Container
      fluid
      className="md:mt-[0px] mt-[25px] min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-6"
    >
      {!templateFile ? (
        <FileUpload onFileSelect={setTemplateFile} />
      ) : !csvStage ? (
        <CertificateCustomizer
          templateFile={templateFile}
          fontFile={fontFile}
          textElements={textElements}
          onFontUpload={setFontFile}
          onTextElementsChange={setTextElements}
          onNext={() => setCsvStage(true)}
        />
      ) : !responseTable ? (
        <EmailAndDataSetup
          onCsvUpload={setCsvFile}
          csvFile={csvFile}
          subject={subject}
          onSubjectChange={setSubject}
          body={body}
          onBodyChange={setBody}
          onSend={sendCertificateHandler}
          onVerifyEmail={handleUserEmailVerification}
          validationSuccess={success}
          validationLoading={validationLoading}
          onVerificationSuccess={(email, password) => {
            setFinalUserEmail(email);
            setFinalUserAppPassword(password);
          }}
        />
      ) : (
        <ResultsDisplay response={responseTable} />
      )}
    </Container>
  );
};

export default CertificateGenerator;
