import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Phone, Email, LinkedIn, Public, GitHub } from "@mui/icons-material";

const ContactPage = () => {
  return (
    <div className="bg-teal-50 min-h-screen flex flex-col items-center mt-[50px]">
      {/* Hero Section */}
      <section className="py-5 w-100 bg-teal-600 text-white text-center">
        <Container>
          <h1 className="display-4 font-bold">Get in Touch</h1>
          <p className="lead mt-3">
            Reach out to the developer behind CertiMail
          </p>
        </Container>
      </section>

      {/* Contact Details */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="p-4 shadow-lg bg-teal-100 border-0 rounded-lg">
              <h2 className="text-teal-700 text-center font-bold mb-4">
                Developer Contact Information
              </h2>
              <div className="text-teal-800 flex flex-col items-center justify-center">
                <h3>Aaditya Mall</h3>
                <p>B1/101 Harasiddh Park, Pawar Nagar, Thane West, 400610</p>
              </div>
              <Row className="justify-content-center mt-4">
                {/* Icons Section */}
                <Col xs="auto" className="text-center">
                  <a
                    href="tel:+919326430750"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="text-teal-700 text-4xl cursor-pointer hover:text-teal-500" />
                  </a>
                </Col>
                <Col xs="auto" className="text-center">
                  <a
                    href="mailto:aadityarmall@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Email className="text-teal-700 text-4xl cursor-pointer hover:text-teal-500" />
                  </a>
                </Col>
                <Col xs="auto" className="text-center">
                  <a
                    href="https://www.linkedin.com/in/aaditya-mall-b45a48216/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedIn className="text-teal-700 text-4xl cursor-pointer hover:text-teal-500" />
                  </a>
                </Col>
                <Col xs="auto" className="text-center">
                  <a
                    href="https://www.aadityamall.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Public className="text-teal-700 text-4xl cursor-pointer hover:text-teal-500" />
                  </a>
                </Col>
                <Col xs="auto" className="text-center">
                  <a
                    href="https://github.com/AadityaMall"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHub className="text-teal-700 text-4xl cursor-pointer hover:text-teal-500" />
                  </a>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Map Section */}
      <section className="py-5 w-100 bg-teal-50">
        <Container className="text-center">
          <h3 className="text-teal-700 font-bold mb-4">Find Me Here</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.248378656765!2d72.96393007425573!3d19.22800404718491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b9502a161553%3A0xc0b4a72efd96bcd5!2sHarasiddh%20Park%20B1%2FB2%20Building!5e0!3m2!1sen!2sin!4v1731609157200!5m2!1sen!2sin"
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
            className="border-0 rounded-lg shadow-lg"
            title="Google Map"
          ></iframe>
        </Container>
      </section>
    </div>
  );
};

export default ContactPage;
