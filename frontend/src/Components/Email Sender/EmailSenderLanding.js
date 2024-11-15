import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetReducers } from "../../Redux/action";
import { Container, Row, Col } from "react-bootstrap";

const MassEmailSenderLanding = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetReducers());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 mt-[50px] flex flex-col items-center justify-center px-4 py-10">
      {/* Main Section */}
      <div className="max-w-2xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-teal-500 mb-4">
          Send Mass Emails Effortlessly
        </h1>
        <p className="text-gray-700 text-lg md:text-xl mb-6">
          Easily reach a large audience by sending personalized emails in bulk with our mass email sender.
        </p>
        <Link to="/mass-email-sender/start">
          <button className="bg-teal-400 text-black font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-500 transition duration-200">
            Get Started
          </button>
        </Link>
      </div>

      {/* Steps Section */}
      <Container className="text-center">
        <h2 className="text-3xl font-bold text-teal-700 mb-8">
          How It Works
        </h2>
        <Row className="">
          {/* Step 1 */}
          <Col md={6} lg={6}>
            <div className="bg-white rounded-lg shadow-lg p-6 min-h-[200px] flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Step 1: Upload CSV & Customize Email
              </h3>
              <p className="text-gray-700">
                Upload a CSV file with recipient information and customize your email message. Personalize fields like recipient name, subject, and message body for a tailored email experience.
              </p>
            </div>
          </Col>

          {/* Step 2 */}
          <Col md={6} lg={6}>
            <div className="bg-white rounded-lg shadow-lg p-6 min-h-[200px] flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Step 2: Use Personal Email
              </h3>
              <p className="text-gray-700">
                Send emails using your personal email address with an app password for secure access.{" "} <br />
                <a
                  href="https://support.google.com/accounts/answer/185833"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-500 underline"
                >
                  Learn how to create an app password
                </a>.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MassEmailSenderLanding;
