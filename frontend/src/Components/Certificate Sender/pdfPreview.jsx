import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PdfPreview = ({ fileUrl }) => {
  return (
    <div className="relative h-auto w-full">
      {fileUrl ? (
        <>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={fileUrl} />
          </Worker>
        </>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default PdfPreview;
