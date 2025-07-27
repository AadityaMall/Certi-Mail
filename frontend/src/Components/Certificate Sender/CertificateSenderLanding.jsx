import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetReducers } from "../../Redux/action";
import { Container, Row, Col } from "react-bootstrap";

const CertificateSenderLanding = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetReducers());
  }, [dispatch]);

  return (
    <div className="min-h-screen mt- bg-gray-100 mt-[50px] flex flex-col items-center justify-center px-4 py-10">
      {/* Main Section */}
      <div className="max-w-2xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-teal-500 mb-4">
          Send Personalized Certificates with Ease
        </h1>
        <p className="text-gray-700 text-lg md:text-xl mb-6">
          Simplify your certificate sending process with CertiMail. Easily
          customize and deliver certificates right to recipients' inboxes.
        </p>
        <Link to="/certificate-sender/start">
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
          <Col md={6} lg={3}>
            <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px] flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Step 1: Upload Template
              </h3>
              <p className="text-gray-700">
                Upload a single-page certificate template to get started. This
                will serve as the base design for your personalized certificates.
              </p>
            </div>
          </Col>

          {/* Step 2 */}
          <Col md={6} lg={3}>
            <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px] flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Step 2: Customize Certificate
              </h3>
              <p className="text-gray-700">
                Place the recipient’s name on the certificate by setting its
                coordinates, font style, and color. Customize it to fit your
                design.
              </p>
            </div>
          </Col>

          {/* Step 3 */}
          <Col md={6} lg={3}>
            <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px] flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Step 3: Upload Recipients
              </h3>
              <p className="text-gray-700">
                Upload a CSV or Excel file with a table containing columns for
                names and emails. CertiMail will generate and send certificates
                to corresponding recipients.
              </p>
            </div>
          </Col>

          {/* Step 4 */}
          <Col md={6} lg={3}>
            <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px] flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Step 4: Use Personal Email
              </h3>
              <p className="text-gray-700">
                Connect your personal email using an app password. <br /><br />
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

export default CertificateSenderLanding;
