import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { AttachFile, Delete } from "@mui/icons-material";

const FileUploadAttachment = ({ files, onFilesChange }) => {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length > 0) {
        const newFiles = [...files, ...acceptedFiles];
        onFilesChange(newFiles);
        toast.success(`${acceptedFiles.length} file(s) added successfully.`);
      }
      if (rejectedFiles.length > 0) {
        toast.error("Some files were rejected. Please check file types.");
      }
    },
    [files, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // Accept all file types
    multiple: true,
  });

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    toast.success("File removed.");
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragActive ? "bg-teal-50 border-teal-400" : "bg-gray-100 border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <AttachFile className="text-teal-500 mb-2" fontSize="large" />
        {isDragActive ? (
          <p className="text-teal-500 font-semibold">Drop files here...</p>
        ) : (
          <>
            <p className="text-gray-700 text-center mb-2">
              Drag & drop files here, or click to select files
            </p>
            <p className="text-gray-500 text-sm">
              All file types supported
            </p>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-teal-700">Attached Files ({files.length}):</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-3 rounded border border-gray-200 shadow-sm"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <AttachFile className="text-teal-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                  type="button"
                >
                  <Delete />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadAttachment;

