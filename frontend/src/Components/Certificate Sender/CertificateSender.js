import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import PdfPreview from "./pdfPreview";
import { toast } from "react-toastify";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import FileUpload from "./FileUpload";
import FileUploadCSV from "../Layout/FileUploadCSV";
import { InfoOutlined, MailOutline, TaskAlt } from "@mui/icons-material";
import EmailEditor from "../Layout/EmailEditor";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  authenticateEmail,
  clearErrors,
  resetReducers,
  sendCertificates,
} from "../../Redux/action";
import Loader from "../Layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
const CertificateGenerator = () => {
  const dispatch = useDispatch();
  const [templateFile, setTemplateFile] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [userName, setUserName] = useState("John Doe");
  const [fontSize, setFontSize] = useState(30);
  const [xCoord, setXCoord] = useState(50);
  const [yCoord, setYCoord] = useState(50);
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [fontFile, setFontFile] = useState(null);
  const [csvStage, setCsvStage] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [finaluserEmail, setfinalUserEmail] = useState(null);
  const [userAppPassword, setUserAppPassword] = useState("");
  const [finaluserAppPassword, setfinalUserAppPassword] = useState(null);

  const { error, responseTable, loading } = useSelector(
    (state) => state.mailStatus
  );
  const {
    error: validationError,
    success,
    loading: validationLoading,
  } = useSelector((state) => state.authenticateUser);

  const columns = [
    { field: "id", headerName: "SR.NO", width: 50 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "status",
      headerName: "Status",
      cellClassName: (params) => {
        return params.row["status"] === "Success"
          ? "text-success"
          : "text-danger";
      },
    },
  ];
  const rows = [];
  responseTable &&
    responseTable.forEach((element, index) => {
      rows.push({
        id: index,
        name: element.Name,
        email: element.Email,
        status: element.Response,
      });
    });

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
    formData.append("xCoord", xCoord);
    formData.append("yCoord", yCoord);
    formData.append("fontSize", fontSize);
    formData.append("color", JSON.stringify(color));
    formData.append("subject", subject);
    formData.append("body", body);
    if (finaluserEmail && finaluserAppPassword) {
      formData.append("userEmail", finaluserEmail);
      formData.append("appPassword", finaluserAppPassword);
    }
    dispatch(sendCertificates(formData));
  };

  const handleUserEmailVerification = (e) => {
    e.preventDefault();
    if (!userEmail || !userAppPassword) {
      toast.error("Please enter valid details");
      return;
    }
    if (userAppPassword.replace(/\s/g, "").length !== 16) {
      toast.error("Please enter a 16 character app password");
      return;
    }
    const formData = {
      email: userEmail,
      appPassword: userAppPassword,
    };

    dispatch(authenticateEmail(formData));
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleBodyChange = (value) => {
    setBody(value);
  };
  const handleFinalStep = () => {
    setCsvStage(true);
  };

  const handleTemplateUpload = (file) => {
    setTemplateFile(file);
  };
  const handleExcelUpload = (file) => {
    setCsvFile(file);
  };
  const handleFontUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "font/ttf" || file.name.endsWith(".ttf"))) {
      setFontFile(file);
    } else {
      toast.error("Please upload a valid TTF font file.");
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
    if(!templateFile){
      dispatch(resetReducers())
    }
    generateCertificate();
    
  }, [templateFile,dispatch]);

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
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch, validationError]);

  useEffect(() => {
    if (success) {
      toast.success("User Validated");
      setfinalUserAppPassword(userAppPassword);
      setfinalUserEmail(userEmail);
    }
  }, [success,userAppPassword,userEmail]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Container
          fluid
          className="md:mt-[0px] mt-[25px] min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-6"
        >
          {!pdfURL && !csvStage ? (
            <div className="text-center">
              <FileUpload onFileSelect={handleTemplateUpload} />
            </div>
          ) : !csvStage ? (
            <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8 mt-5">
              <h3 className="text-2xl text-center font-bold text-teal-600 mb-4 my-[10px]">
                Customize Your Certificate
              </h3>
              <Row>
                <Col
                  md={6}
                  className="flex flex-col justify-center items-center"
                >
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
                        onChange={(e) =>
                          setFontSize(parseInt(e.target.value) || 0)
                        }
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
                          onChange={(e) =>
                            setXCoord(parseInt(e.target.value) || 0)
                          }
                          className="rounded border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                        <Form.Control
                          type="number"
                          placeholder="Y"
                          value={yCoord}
                          onChange={(e) =>
                            setYCoord(parseInt(e.target.value) || 0)
                          }
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
                        onClick={handleFinalStep}
                        className="bg-green-500 text-white font-semibold py-2 px-6 rounded shadow hover:bg-green-600"
                      >
                        Next
                      </button>
                    </div>
                  </Form>
                </Col>
              </Row>
            </div>
          ) : !responseTable ? (
            <>
              <Container
                fluid
                className="flex flex-col min-h-screen justify-center items-center mt-[40px]"
              >
                <Row>
                  <Col md={6}>
                    {!csvFile ? (
                      <>
                        <div className="text-center mt-4">
                          <FileUploadCSV onFileSelect={handleExcelUpload} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-center justify-center">
                          <div className="container mx-auto p-4">
                            <div>
                              <div
                                className={`col-span-1 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center bg-teal-50 `}
                              >
                                <h3 className="text-2xl md:text-4xl text-teal-500 mb-4">
                                  File Uploaded Successfully{" "}
                                  <TaskAlt color="teal" fontSize="40" />
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </Col>
                  <Col md={6} className="border-2 border-black">
                    <div className="p-2">
                      <h3 className="text-2xl md:text-4xl text-teal-500 mb-4">
                        Customize your mail
                      </h3>
                      <Form>
                        <Form.Group controlId="emailSubject">
                          <Form.Label className="font-bold">Subject</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter email subject"
                            value={subject}
                            onChange={handleSubjectChange}
                            required
                            className="bg-transparent"
                          />
                        </Form.Group>

                        <Form.Group controlId="emailBody" className="p-2">
                          <Form.Label className="font-bold">Body</Form.Label>
                          <EmailEditor
                            body={body}
                            onBodyChange={handleBodyChange}
                          />
                        </Form.Group>
                      </Form>
                    </div>
                  </Col>
                </Row>
                {console.log(success)}
                <Container
                  className={`${
                    success ? "bg-[#B2FBA5]" : "bg-[#ffadad]"
                  } p-2 my-[20px] flex flex-col justify-center items-center`}
                >
                  {!success ? (
                    <>
                      <div className="flex justify-center items-center flex-wrap">
                        <InfoOutlined
                          htmlColor="red"
                          fontSize="large"
                          className="my-[10px]"
                        />
                        <div className="w-100 text-wrap">
                          <p className="text-wrap">
                            Emails will be sent from{" "}
                            <strong>email:collegeprojects09@gmail.com</strong>
                          </p>
                          <p>
                            If you wish to send emails from your account, please
                            provide with your Gmail Id and{" "}
                            <Link
                              className="text-black"
                              to={`https://knowledge.workspace.google.com/kb/how-to-create-app-passwords-000009237`}
                            >
                              App Password
                            </Link>
                          </p>
                        </div>
                      </div>
                      <Container>
                        <Form onSubmit={handleUserEmailVerification}>
                          <Row>
                            <Col md={4}>
                              {" "}
                              <Form.Group
                                controlId="userEmail"
                                className="mx-2"
                              >
                                <Form.Label className="font-bold">
                                  Email
                                </Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="Enter email"
                                  value={userEmail}
                                  onChange={(e) => setUserEmail(e.target.value)}
                                  required
                                  className="bg-transparent border-red-950 border-2"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              {" "}
                              <Form.Group
                                controlId="userPassword"
                                className="mx-2"
                              >
                                <Form.Label className="font-bold">
                                  App Password
                                </Form.Label>
                                <Form.Control
                                  type="password"
                                  minLength={16}
                                  placeholder=" Enter App Password"
                                  value={userAppPassword}
                                  onChange={(e) =>
                                    setUserAppPassword(e.target.value)
                                  }
                                  required
                                  className="bg-transparent border-red-950 border-2"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <div className="flex flex-col justify-end h-full">
                                <button
                                  disabled={validationLoading}
                                  className="w-full py-[8px] md:my-[0px] my-[8px] h-auto bg-red-500 text-white rounded shadow hover:bg-red-600"
                                >
                                  {validationLoading
                                    ? "Verifyingg...."
                                    : "Verify"}
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </Container>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center items-center flex-wrap">
                        <TaskAlt
                          htmlColor="green"
                          fontSize="large"
                          className="my-[10px]"
                        />
                        <div className="w-100 text-wrap">
                          <p className="text-wrap">
                            Emails will be sent from{" "}
                            <strong>email:{userEmail}</strong>
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </Container>
                <button
                  onClick={sendCertificateHandler}
                  className="mt-4 min-w-80 max-w-80 px-6 py-2 bg-teal-500 text-white rounded shadow hover:bg-teal-600"
                >
                  Send Certificates <MailOutline />
                </button>
              </Container>
            </>
          ) : (
            <>
              <div className="flex justify-center items-center w-full min-h-screen overflow-x-scroll">
                <div className="flex flex-col justify-center items-center">
                  <h3 className="text-teal-500">Results.</h3>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5,
                        },
                      },
                    }}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                  />
                </div>
              </div>
            </>
          )}
        </Container>
      )}
    </>
  );
};

export default CertificateGenerator;
