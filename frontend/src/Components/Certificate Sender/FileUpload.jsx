import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Helper validation functions remain the same
const validatePDFHeader = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const header = new Uint8Array(arrayBuffer.slice(0, 4));
  return (
    header[0] === 0x25 &&
    header[1] === 0x50 &&
    header[2] === 0x44 &&
    header[3] === 0x46
  );
};
const checkSinglePagePDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDocument = await pdfjsLib.getDocument(arrayBuffer).promise;
    return pdfDocument.numPages === 1;
  } catch (error) {
    toast.error("Error parsing PDF. Please upload a valid PDF file.");
    return false;
  }
};

const FileUpload = ({ onFileSelect }) => {
  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const isPDF = await validatePDFHeader(file);
        if (!isPDF) {
          toast.error("Invalid file: Please upload a valid PDF document.");
          return;
        }
        const isSinglePage = await checkSinglePagePDF(file);
        if (!isSinglePage) {
          toast.error("Please upload a single-page PDF file.");
          return;
        }
        onFileSelect(file);
      } else if (rejectedFiles.length > 0) {
        toast.error("Please upload a PDF file.");
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  });

  return (
    <>
      <div className="max-w-4xl w-full p-3 rounded-4 shadow-lg text-white !bg-teal-500">
        <div className="row align-items-center g-5">
          {/* Left Column: Text Content */}
          <div className="col-lg-6 text-md text-center">
            <h3 className="fw-bold display-5 mb-3">
              Upload Your Certificate Template
            </h3>
            <p className="text-md font-semibold">
              Drag & drop a single-page PDF file, or click to select one.
            </p>
          </div>

          {/* Right Column: Dropzone */}
          <div className="col-lg-6 flex flex-col items-center justify-center">
            <div
              {...getRootProps()}
              className={`dropzone p-5 rounded-3 text-center ${
                isDragActive ? "active" : ""
              } border-dotted border-2 border-teal-800 flex flex-col items-center justify-center bg-teal-50`}
            >
              <input {...getInputProps()} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                fill="teal"
                className="bi bi-cloud-arrow-up-fill mb-3"
                viewBox="0 0 16 16"
              >
                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z" />
              </svg>
              <p className="fw-semibold fs-5 text-teal-500">
                {isDragActive
                  ? "Drop the file here..."
                  : "Drag & drop your file"}
              </p>
              <p className="mb-3 d-none d-lg-block text-teal-500">or</p>
              <button
                type="button"
                className="btn btn-dark fw-bold py-2 px-4 shadow"
              >
                Choose File
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;