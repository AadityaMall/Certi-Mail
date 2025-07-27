import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import FileUploadCSV from "../Layout/FileUploadCSV";
import EmailEditor from "../Layout/EmailEditor";
import { InfoOutlined, MailOutline, TaskAlt } from "@mui/icons-material";

const EmailAndDataSetup = ({
  onCsvUpload,
  csvFile,
  subject,
  onSubjectChange,
  body,
  onBodyChange,
  onSend,
  onVerifyEmail,
  validationSuccess,
  validationLoading,
  onVerificationSuccess,
}) => {
  const [userEmail, setUserEmail] = useState("");
  const [userAppPassword, setUserAppPassword] = useState("");

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    onVerifyEmail(userEmail, userAppPassword);
  };
  
  useEffect(() => {
    if (validationSuccess) {
      onVerificationSuccess(userEmail, userAppPassword);
    }
  }, [validationSuccess, userEmail, userAppPassword, onVerificationSuccess]);


  return (
    <>
      <Container fluid className="flex flex-col min-h-screen justify-center items-center mt-[40px]">
        <Row>
          <Col md={6}>
            {!csvFile ? (
              <div className="text-center mt-4">
                <FileUploadCSV onFileSelect={onCsvUpload} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="container mx-auto p-4">
                  <div>
                    <div className={`col-span-1 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center bg-teal-50 `}>
                      <h3 className="text-2xl md:text-4xl text-teal-500 mb-4">
                        File Uploaded Successfully{" "}
                        <TaskAlt color="teal" fontSize="40" />
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Col>
          <Col md={6} className="border-2 border-black">
            <div className="p-2">
              <h3 className="text-2xl md:text-4xl text-teal-500 mb-4">Customize your mail</h3>
              <Form>
                <Form.Group controlId="emailSubject">
                  <Form.Label className="font-bold">Subject</Form.Label>
                  <Form.Control type="text" placeholder="Enter email subject" value={subject} onChange={(e) => onSubjectChange(e.target.value)} required className="bg-transparent"/>
                </Form.Group>
                <Form.Group controlId="emailBody" className="p-2">
                  <Form.Label className="font-bold">Body</Form.Label>
                  <EmailEditor body={body} onBodyChange={onBodyChange} />
                </Form.Group>
              </Form>
            </div>
          </Col>
        </Row>
        
        <Container className={`${validationSuccess ? "bg-[#B2FBA5]" : "bg-[#ffadad]"} p-2 my-[20px] flex flex-col justify-center items-center`}>
          {!validationSuccess ? (
            <>
              <div className="flex justify-center items-center flex-wrap">
                <InfoOutlined htmlColor="red" fontSize="large" className="my-[10px]" />
                <div className="w-100 text-wrap">
                  <p className="text-wrap">Emails will be sent from <strong>email:collegeprojects09@gmail.com</strong></p>
                  <p>If you wish to send emails from your account, please provide with your Gmail Id and{" "}<Link className="text-black" to={`https://knowledge.workspace.google.com/kb/how-to-create-app-passwords-000009237`}>App Password</Link></p>
                </div>
              </div>
              <Container>
                <Form onSubmit={handleVerificationSubmit}>
                  <Row>
                    <Col md={4}><Form.Group controlId="userEmail" className="mx-2"><Form.Label className="font-bold">Email</Form.Label><Form.Control type="email" placeholder="Enter email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required className="bg-transparent border-red-950 border-2"/></Form.Group></Col>
                    <Col md={4}><Form.Group controlId="userPassword" className="mx-2"><Form.Label className="font-bold">App Password</Form.Label><Form.Control type="password" minLength={16} placeholder=" Enter App Password" value={userAppPassword} onChange={(e) => setUserAppPassword(e.target.value)} required className="bg-transparent border-red-950 border-2"/></Form.Group></Col>
                    <Col md={4}><div className="flex flex-col justify-end h-full"><button disabled={validationLoading} className="w-full py-[8px] md:my-[0px] my-[8px] h-auto bg-red-500 text-white rounded shadow hover:bg-red-600">{validationLoading ? "Verifyingg...." : "Verify"}</button></div></Col>
                  </Row>
                </Form>
              </Container>
            </>
          ) : (
            <div className="flex justify-center items-center flex-wrap">
              <TaskAlt htmlColor="green" fontSize="large" className="my-[10px]" />
              <div className="w-100 text-wrap">
                <p className="text-wrap">Emails will be sent from <strong>email:{userEmail}</strong></p>
              </div>
            </div>
          )}
        </Container>

        <button onClick={onSend} className="mt-4 min-w-80 max-w-80 px-6 py-2 bg-teal-500 text-white rounded shadow hover:bg-teal-600">
          Send Certificates <MailOutline />
        </button>
      </Container>
    </>
  );
};

export default EmailAndDataSetup;