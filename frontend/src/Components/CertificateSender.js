import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import PdfPreview from "./pdfPreview";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";

const CertificateGenerator = () => {
  const [templateFile, setTemplateFile] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [userName, setUserName] = useState("John Doe");
  const [fontSize, setFontSize] = useState(30);
  const [xCoord, setXCoord] = useState(50);
  const [yCoord, setYCoord] = useState(50);
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [fontFile, setFontFile] = useState(null);

  // Handle PDF template upload
  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setTemplateFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Handle TTF font file upload
  const handleFontUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "font/ttf" || file.name.endsWith(".ttf"))) {
      setFontFile(file);
    } else {
      alert("Please upload a valid TTF font file.");
    }
  };

  // Handle color input and convert to 0-1 scale
  const handleColorChange = (e) => {
    const colorHex = e.target.value;
    const r = parseInt(colorHex.slice(1, 3), 16) / 255;
    const g = parseInt(colorHex.slice(3, 5), 16) / 255;
    const b = parseInt(colorHex.slice(5, 7), 16) / 255;
    setColor({ r, g, b });
  };

  // Generate the certificate with selected properties
  const generateCertificate = async () => {
    if (!templateFile) return;

    const fontBytes = fontFile ? await fontFile.arrayBuffer() : null;
    const pdfBytes = await templateFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const customFont = fontBytes
      ? await pdfDoc.embedFont(fontBytes)
      : pdfDoc.embedStandardFont("Helvetica");
    const firstPage = pdfDoc.getPages()[0];

    firstPage.drawText(userName, {
      x: xCoord,
      y: yCoord,
      size: fontSize,
      font: customFont,
      color: rgb(color.r, color.g, color.b),
    });

    const modifiedPdfBytes = await pdfDoc.save();
    setPdfURL(
      URL.createObjectURL(
        new Blob([modifiedPdfBytes], { type: "application/pdf" })
      )
    );
  };

  // Generate certificate whenever dependencies change
  useEffect(() => {
    generateCertificate();
  }, [templateFile]);

  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center"
    >
      {!pdfURL ? (
        <div className="text-center">
          <h4>Upload Certificate Template</h4>
          <input type="file" accept=".pdf" onChange={handleTemplateUpload} />
        </div>
      ) : (
        <>
          <div className="flex w-100 flex-col">
            <Row className="w-100">
              <Col
                md={6}
                className="d-flex align-items-center justify-content-center"
              >
                <PdfPreview fileUrl={pdfURL} />
              </Col>
              <Col md={6} className="p-4">
                <h4>Customize Your Certificate</h4>
                <Form>
                  <Form.Group controlId="userName">
                    <Form.Label>Enter Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter Name"
                    />
                  </Form.Group>

                  <Form.Group controlId="fontUpload">
                    <Form.Label>Upload Custom TTF Font (optional)</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".ttf"
                      onChange={handleFontUpload}
                    />
                  </Form.Group>

                  <Form.Group controlId="fontSize">
                    <Form.Label>Font Size</Form.Label>
                    <Form.Control
                      type="number"
                      value={fontSize}
                      onChange={(e) =>
                        setFontSize(parseInt(e.target.value) || 0)
                      }
                    />
                  </Form.Group>

                  <Form.Group controlId="coordinates">
                    <Form.Label>Coordinates</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        placeholder="X"
                        value={xCoord}
                        onChange={(e) =>
                          setXCoord(parseInt(e.target.value) || 0)
                        }
                      />
                      <Form.Control
                        type="number"
                        placeholder="Y"
                        value={yCoord}
                        onChange={(e) =>
                          setYCoord(parseInt(e.target.value) || 0)
                        }
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="color">
                    <Form.Label>Text Color</Form.Label>
                    <Form.Control type="color" onChange={handleColorChange} />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <button className="bg-teal-500 font-bold mx-[50px]" onClick={generateCertificate}>Check Certificate</button>
            <button className="mx-[50px] my-[10px] bg-[#5cb85c]">Next</button>
          </div>
        </>
      )}
    </Container>
  );
};

export default CertificateGenerator;
