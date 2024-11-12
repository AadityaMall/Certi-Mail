import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

const NavBar = () => {
  const [expanded, setExpanded] = useState(false);

  const handleToggleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Navbar
      expanded={expanded}
      expand="md"
      fixed="top"
      bg="light"
      className="p-2 shadow-sm"
    >
      <Container>
        <Navbar.Brand href="/" className="text-teal-500 font-bold text-2xl">
          CertiMail
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="navbar-nav"
          onClick={handleToggleClick}
          className="border-0 outline-none"
        >
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto text-center">
            <Nav.Item>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive
                    ? "nav-link text-teal-500 font-bold px-4 py-2"
                    : "nav-link text-gray-700 hover:text-teal-500 px-4 py-2"
                }
              >
                Home
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link text-teal-500 font-bold px-4 py-2"
                    : "nav-link text-gray-700 hover:text-teal-500 px-4 py-2"
                }
              >
                Contact
              </NavLink>
            </Nav.Item>

            <Nav.Item className="ms-md-3 mt-2 mt-md-0">
              <Button
                href="/certificate-sender"
                variant="primary"
                className="bg-teal-400 border-teal-400 text-black font-bold px-6 py-2 rounded"
                onClick={() => setExpanded(false)}
              >
                Certificate Sender
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
