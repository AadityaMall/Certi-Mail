import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EmailEditor = ({ body, onBodyChange }) => {
  return (
      <ReactQuill
        value={body}
        onChange={onBodyChange}
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["bold", "italic", "underline"],
            ["link"],
            ["blockquote"],
          ],
        }}
        theme="snow"
        required
        className="max-h-72 min-h-32 overflow-y-auto"
      />
  );
};

export default EmailEditor;
