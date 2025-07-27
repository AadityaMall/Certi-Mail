import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import PdfPreview from "./pdfPreview"; // Assuming this component exists
import { toast } from "react-toastify";

const CertificateCustomizer = ({
  templateFile,
  textElements,
  onFontUpload,
  onTextElementsChange,
  onNext,
}) => {
  const [pdfURL, setPdfURL] = useState(null);
  const [font, setFont] = useState(null);

  const addElement = () => {
    onTextElementsChange([
      ...textElements,
      {
        id: Date.now(),
        text: "Sample Text",
        fontSize: 30,
        xCoord: 50,
        yCoord: 50,
        color: { r: 0, g: 0, b: 0 },
        col: "",
      },
    ]);
  };

  const removeElement = (id) => {
    onTextElementsChange(textElements.filter((el) => el.id !== id));
  };

  const updateElement = (id, newProps) => {
    onTextElementsChange(
      textElements.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  const generateCertificatePreview = async () => {
    if (!templateFile) return;
    try {
      const pdfBytes = await templateFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      pdfDoc.registerFontkit(fontkit);
      const customFont = font
        ? await pdfDoc.embedFont(font)
        : await pdfDoc.embedStandardFont("Helvetica");
      const firstPage = pdfDoc.getPages()[0];

      for (const element of textElements) {
        firstPage.drawText(element.text, {
          x: element.xCoord,
          y: element.yCoord,
          size: element.fontSize,
          font: customFont,
          color: rgb(element.color.r, element.color.g, element.color.b),
        });
      }
      const modifiedPdfBytes = await pdfDoc.save();
      setPdfURL(
        URL.createObjectURL(
          new Blob([modifiedPdfBytes], { type: "application/pdf" })
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    generateCertificatePreview();
  }, [templateFile]);

  const handleFontFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "font/ttf" || file.name.endsWith(".ttf"))) {
      onFontUpload(file);
      const fontBytes = await file.arrayBuffer();
      setFont(fontBytes);
    } else {
      toast.error("Please upload a valid TTF font file.");
    }
  };

  return (
    <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8 mt-5">
      <h3 className="text-2xl text-center font-bold text-teal-600 mb-4 my-[10px]">
        Customize Your Certificate
      </h3>
      <Row>
        <Col
          md={6}
          className="flex flex-col justify-center items-center mb-4 md:mb-0"
        >
          <div className="w-full bg-gray-100 rounded-lg shadow-inner p-2 mb-3">
            {pdfURL && <PdfPreview fileUrl={pdfURL} />}
          </div>
        </Col>

        <Col md={6}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-teal-700 font-semibold text-lg">
              Text Elements
            </h4>
            <button
              type="button"
              onClick={addElement}
              className="bg-teal-500 text-white py-1 px-3 rounded-md shadow hover:bg-teal-600 transition duration-300 flex items-center"
            >
              Add Element
            </button>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {textElements.map((element) => (
              <div
                key={element.id}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-semibold text-teal-600">
                    Element Details
                  </h5>
                  <button
                    type="button"
                    onClick={() => removeElement(element.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-teal-700 font-medium">
                        Preview Text
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={element.text}
                        onChange={(e) =>
                          updateElement(element.id, { text: e.target.value })
                        }
                        placeholder="Enter sample text"
                        className="rounded border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </Form.Group>{" "}
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-teal-700 font-medium">
                        Excel Column Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={element.col}
                        onChange={(e) =>
                          updateElement(element.id, {
                            col: e.target.value,
                          })
                        }
                        placeholder="Enter column name from Excel (e.g. Name, Email)"
                        className="rounded border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Row>
                      <Col md={6} sm={6} xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-teal-700 font-medium">
                            Font Size
                          </Form.Label>
                          <Form.Control
                            type="number"
                            value={element.fontSize}
                            onChange={(e) =>
                              updateElement(element.id, {
                                fontSize: parseInt(e.target.value) || 0,
                              })
                            }
                            className="rounded border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6} sm={6} xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-teal-700 font-medium">
                            Text Color
                          </Form.Label>
                          <Form.Control
                            type="color"
                            value={`#${Object.values(element.color)
                              .map((c) =>
                                Math.round(c * 255)
                                  .toString(16)
                                  .padStart(2, "0")
                              )
                              .join("")}`}
                            onChange={(e) => {
                              const r =
                                parseInt(e.target.value.slice(1, 3), 16) / 255;
                              const g =
                                parseInt(e.target.value.slice(3, 5), 16) / 255;
                              const b =
                                parseInt(e.target.value.slice(5, 7), 16) / 255;
                              updateElement(element.id, { color: { r, g, b } });
                            }}
                            className="rounded border-gray-300"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-teal-700 font-medium">
                        Coordinates
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          placeholder="X"
                          value={element.xCoord}
                          onChange={(e) =>
                            updateElement(element.id, {
                              xCoord: parseInt(e.target.value) || 0,
                            })
                          }
                          className="rounded border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                        <Form.Control
                          type="number"
                          placeholder="Y"
                          value={element.yCoord}
                          onChange={(e) =>
                            updateElement(element.id, {
                              yCoord: parseInt(e.target.value) || 0,
                            })
                          }
                          className="rounded border-gray-300 focus:border-teal-500 focus:ring-teal-500 ml-2"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
          </div>

          <Form.Group controlId="fontUpload" className="my-3">
            <Form.Label className="text-teal-700 font-medium">
              Upload Custom TTF Font (optional)
            </Form.Label>
            <Form.Control
              type="file"
              accept=".ttf"
              onChange={handleFontFileChange}
              className="rounded border-gray-300"
            />
          </Form.Group>

          <div className="flex justify-start space-x-4 mt-6">
            <button
              type="button"
              onClick={generateCertificatePreview}
              className="bg-teal-500 text-white font-semibold py-2 px-6 rounded shadow hover:bg-teal-600"
            >
              Check Certificate
            </button>
            <button
              type="button"
              onClick={onNext}
              className="bg-green-500 text-white font-semibold py-2 px-6 rounded shadow hover:bg-green-600"
            >
              Next
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CertificateCustomizer;
