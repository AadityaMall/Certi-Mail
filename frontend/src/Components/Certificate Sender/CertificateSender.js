import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import PdfPreview from "./pdfPreview";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import FileUpload from "./FileUpload";

const CertificateGenerator = () => {
  const [templateFile, setTemplateFile] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [userName, setUserName] = useState("John Doe");
  const [fontSize, setFontSize] = useState(30);
  const [xCoord, setXCoord] = useState(50);
  const [yCoord, setYCoord] = useState(50);
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [fontFile, setFontFile] = useState(null);

  const handleTemplateUpload = (file) => {
    setTemplateFile(file);
  };

  const handleFontUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "font/ttf" || file.name.endsWith(".ttf"))) {
      setFontFile(file);
    } else {
      alert("Please upload a valid TTF font file.");
    }
  };

  const handleColorChange = (e) => {
    const colorHex = e.target.value;
    const r = parseInt(colorHex.slice(1, 3), 16) / 255;
    const g = parseInt(colorHex.slice(3, 5), 16) / 255;
    const b = parseInt(colorHex.slice(5, 7), 16) / 255;
    setColor({ r, g, b });
  };

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

  useEffect(() => {
    generateCertificate();
  }, [templateFile]);

  return (
    <Container
      fluid
      className="md:mt-[0px] mt-[25px] h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-6"
    >
      {!pdfURL ? (
        <div className="text-center">
          <FileUpload onFileSelect={handleTemplateUpload} />
        </div>
      ) : (
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8 mt-5">
          <h3 className="text-2xl text-center font-bold text-teal-600 mb-4 my-[10px]">
            Customize Your Certificate
          </h3>
          <Row>
            <Col md={6} className="flex flex-col justify-center items-center">
              <PdfPreview fileUrl={pdfURL} />
            </Col>
            <Col md={6}>
              <Form className="md:mt-[0px] mt-[25px]">
                <Form.Group controlId="userName" className="mb-3">
                  <Form.Label className="text-teal-700 font-medium">
                    Enter Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter Name"
                    className="rounded border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </Form.Group>

                <Form.Group controlId="fontUpload" className="mb-3">
                  <Form.Label className="text-teal-700 font-medium">
                    Upload Custom TTF Font (optional)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept=".ttf"
                    onChange={handleFontUpload}
                    className="rounded border-gray-300"
                  />
                </Form.Group>

                <Form.Group controlId="fontSize" className="mb-3">
                  <Form.Label className="text-teal-700 font-medium">
                    Font Size
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value) || 0)}
                    className="rounded border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </Form.Group>

                <Form.Group controlId="coordinates" className="mb-3">
                  <Form.Label className="text-teal-700 font-medium">
                    Coordinates
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      placeholder="X"
                      value={xCoord}
                      onChange={(e) => setXCoord(parseInt(e.target.value) || 0)}
                      className="rounded border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                    <Form.Control
                      type="number"
                      placeholder="Y"
                      value={yCoord}
                      onChange={(e) => setYCoord(parseInt(e.target.value) || 0)}
                      className="rounded border-gray-300 focus:border-teal-500 focus:ring-teal-500 ml-2"
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="color" className="mb-3">
                  <Form.Label className="text-teal-700 font-medium">
                    Text Color
                  </Form.Label>
                  <Form.Control
                    type="color"
                    onChange={handleColorChange}
                    className="rounded border-gray-300"
                  />
                </Form.Group>

                <div className="flex justify-start space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={generateCertificate}
                    className="bg-teal-500 text-white font-semibold py-2 px-6 rounded shadow hover:bg-teal-600"
                  >
                    Check Certificate
                  </button>
                  <button
                    type="button"
                    className="bg-green-500 text-white font-semibold py-2 px-6 rounded shadow hover:bg-green-600"
                  >
                    Next
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
};

export default CertificateGenerator;
