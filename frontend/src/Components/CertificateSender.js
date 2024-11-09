import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WebFont from 'webfontloader';

const CertificateGenerator = () => {
  const [fonts, setFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState('');
  const [templateFile, setTemplateFile] = useState(null);
  const [userName, setUserName] = useState('John Doe');

  // Fetch Google Fonts list
  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.REACT_APP_FONTS_KEY}`
        );
        setFonts(response.data.items);
      } catch (error) {
        console.error('Error fetching fonts:', error);
      }
    };
    fetchFonts();
  }, []);

  // Load Google Font preview
  useEffect(() => {
    if (selectedFont) {
      WebFont.load({ google: { families: [selectedFont] } });
    }
  }, [selectedFont]);

  // Handle PDF template upload
  const handleTemplateUpload = (e) => {
    setTemplateFile(e.target.files[0]);
  };

  // Handle submission
  const handleGenerateCertificate = async () => {
    if (!templateFile || !selectedFont) {
      alert('Please select a font and upload a template.');
      return;
    }

    const formData = new FormData();
    formData.append('name', userName);
    formData.append('fontName', selectedFont);
    formData.append('template', templateFile);

    try {
      const response = await axios.post('http://localhost:4000/generate-certificate', formData);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h3>Generate Certificate</h3>

      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter Name"
        style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
      />

      <h4>Select Google Font</h4>
      <select
        onChange={(e) => setSelectedFont(e.target.value)}
        style={{ padding: '8px', width: '100%' }}
      >
        <option value="" disabled selected>
          Choose a font
        </option>
        {fonts.map((font) => (
          <option key={font.family} value={font.family}>
            {font.family}
          </option>
        ))}
      </select>

      <h4>Upload Certificate Template</h4>
      <input type="file" accept=".pdf" onChange={handleTemplateUpload} />

      <button onClick={handleGenerateCertificate} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Generate Certificate
      </button>

      <h4>Preview Text</h4>
      <div
        style={{
          fontFamily: selectedFont,
          fontSize: '24px',
          padding: '10px',
          border: '1px solid #ccc',
          marginTop: '10px',
        }}
      >
        {userName}
      </div>
    </div>
  );
};

export default CertificateGenerator;
