import React, { useState } from 'react';
import axios from 'axios';

const CertificateUploader = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [certificateDesign, setCertificateDesign] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    // Validate that both files are uploaded
    if (!excelFile || !certificateDesign) {
      alert('Please upload both files.');
      return;
    }

    // Prepare form data for uploading
    const formData = new FormData();
    formData.append('excelFile', excelFile);
    formData.append('certificateDesign', certificateDesign);

    try {
      // Send a POST request to the backend to upload files
      const response = await axios.post(
        `${process.env.REACT_APP_API_LINK}upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      console.log(response.data);
      alert('Certificates sent successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files.');
    }
  };

  return (
    <form onSubmit={handleUpload} style={styles.form}>
      <div style={styles.inputWrapper}>
        <label htmlFor="excelFile" style={styles.label}>
          Upload Excel File:
        </label>
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setExcelFile(e.target.files[0])}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.inputWrapper}>
        <label htmlFor="certificateDesign" style={styles.label}>
          Upload Certificate Design:
        </label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setCertificateDesign(e.target.files[0])}
          required
          style={styles.input}
        />
      </div>

      <button type="submit" style={styles.button}>
        Upload and Send Certificates
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '400px',
    margin: '0 auto',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default CertificateUploader;
