import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import Papa from "papaparse";
import * as XLSX from "xlsx"; // Import XLSX

// Function to validate if the file contains "Name" and "Email" columns
const validateCSVColumns = (headers) => {
  return headers.includes("Name") && headers.includes("Email");
};

const validateExcelColumns = (sheet) => {
  const headers = sheet[0]; // First row is usually the header in Excel sheets
  return headers.includes("Name") && headers.includes("Email");
};

const FileUploadCSV = ({ onFileSelect }) => {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // If the file is a CSV
        if (file.type === "text/csv") {
          Papa.parse(file, {
            header: true,
            complete: (results) => {
              const headers = results.meta.fields;
              if (validateCSVColumns(headers)) {
                onFileSelect(file);
                toast.success("CSV uploaded successfully.");
              } else {
                toast.error("CSV must contain 'Name' and 'Email' columns.");
              }
            },
            error: () => {
              toast.error("Error parsing CSV file. Please upload a valid CSV.");
            },
          });
        }

        // If the file is an Excel file (.xlsx)
        else if (
          file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            // Assuming the first sheet is the one we're interested in
            const sheet = XLSX.utils.sheet_to_json(
              workbook.Sheets[workbook.SheetNames[0]],
              { header: 1 }
            );

            if (validateExcelColumns(sheet)) {
              onFileSelect(file);
              toast.success("Excel file uploaded successfully.");
            } else {
              toast.error(
                "Excel file must contain 'Name' and 'Email' columns."
              );
            }
          };
          reader.readAsArrayBuffer(file);
        } else {
          toast.error("Please upload a valid CSV or Excel file.");
        }
      } else if (rejectedFiles.length > 0) {
        toast.error("Please upload a valid file.");
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".csv", ".xlsx"], // Accept both CSV and Excel files
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="container mx-auto p-4">
        <div>
          <div
            {...getRootProps()}
            className={`col-span-1 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center
            ${isDragActive ? "bg-teal-50" : "bg-gray-100"} cursor-pointer`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <>
                <p className="text-teal-500">
                  Drop the CSV or Excel file here...
                </p>
              </>
            ) : (
              <>
                <h4 className="text-2xl md:text-4xl font-bold text-teal-500 mb-4">
                  Upload Your CSV or Excel File
                </h4>
                <p className="text-gray-700">
                  Drag & drop a CSV or Excel file here, or click to select one
                </p>
              </>
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

export default FileUploadCSV;
