import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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

// Function to check if PDF is single-page
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

        // Step 1: Validate PDF Header
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
    accept: ".pdf",
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="col-span-1 text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-bold text-teal-500 mb-4">
              Upload Your Certificate Template
            </h2>
            <p className="text-gray-600">
              Drag & drop a PDF file here, or click to select one.
            </p>
          </div>

          <div
            {...getRootProps()}
            className={`col-span-1 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center
            ${isDragActive ? "bg-teal-50" : "bg-gray-100"} cursor-pointer`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-teal-500">Drop the PDF file here...</p>
            ) : (
              <p className="text-gray-700">
                Drag & drop a PDF file here, or click to select one
              </p>
            )}
            <button className="mt-4 px-6 py-2 bg-teal-500 text-white rounded shadow hover:bg-teal-600">
              Choose File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
