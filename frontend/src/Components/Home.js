import React from "react";
import { MailOutline, Send } from "@mui/icons-material";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-teal-50 mt-[50px] min-h-screen d-flex flex-column align-items-center">
      <section className="text-center py-5 bg-teal-600 text-white w-100">
        <Container>
          <h1 className="display-4 font-bold">Welcome to CertiMail</h1>
          <p className="lead mt-3">
            Automate certificate generation and mass email sending in one
            platform.
          </p>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="text-center">
          <Col md={6} className="mb-1">
            <Card
              onClick={() => navigate("/certificate-sender")}
              className="shadow-md hover:shadow-lg my-[10px] border-0 p-4 bg-teal-100 hover:bg-teal-200 hover:cursor-pointer"
            >
              <MailOutline
                fontSize="large"
                className="text-teal-600 mb-3 absolute top-2 left-3"
              />
              <h3 className="text-teal-800">Certificate Sender</h3>
              <p className="text-teal-700">
                Generate and send customized certificates to recipients with
                ease.
              </p>
              <span className="text-teal-800 font-bold text-xl">
                Get Started
              </span>
            </Card>
          </Col>
          <Col md={6} className="mb-1">
            <Card
              onClick={() => navigate("/mail-sender")}
              className="shadow-md hover:shadow-lg my-[10px] border-0 p-4 bg-teal-100 hover:bg-teal-200 hover:cursor-pointer"
            >
              <Send
                fontSize="large"
                className="text-teal-600 mb-3 absolute top-2 left-3"
              />
              <h3 className="text-teal-800">Mass Email Sender</h3>
              <p className="text-teal-700">
                Send mass emails efficiently with few clicks.
              </p>
              <span className="text-teal-800 font-bold text-xl">
                Get Started
              </span>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* About Section */}
      <section className="bg-teal-50 py-5 w-100">
        <Container>
          <h2 className="text-center text-teal-800 font-bold mb-4">
            About CertiMail
          </h2>
          <Row>
            <Col md={6} className="mb-4">
              <p className="text-teal-800 text-justify">
                CertiMail is designed to streamline workflows by automating
                certificate distribution and mass emailing. Whether you need to
                send certificates to multiple recipients or handle a large-scale
                email campaign, CertiMail provides the tools to make it
                effortless. Originally, the goal was to automate certificate
                generation and sending, sparing the design team from manually
                adding names to hundreds of certificates. Simply upload a single
                template, set a few coordinates, select fonts and colors, and
                upload an Excel file containing names and corresponding email
                addresses. This project was initially developed for{" "}
                <a className="font-bold" href="https://ietmpstme.in">
                  IET MPSTME On Campus.
                </a>
                <br />
                Additional features, such as the mass mailer, were added to
                enable one-click bulk emailing. With this feature, emails can be
                automatically sent to any number of users from your email
                account using your credentials and app password.
              </p>
            </Col>
            <Col md={6}>
              {/* You can replace these placeholder divs with actual GIFs or images */}
              <div className=" w-full h-full flex items-center justify-center">
                <iframe title="homeAboutGIF" src="https://lottie.host/embed/16c025f2-0015-4cb1-9a14-74cdd2db7fec/FOBiojoK5M.json"></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
