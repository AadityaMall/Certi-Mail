import React, { useState } from 'react';

const FontUploader = () => {
  const [fontFile, setFontFile] = useState(null);
  const [fontName, setFontName] = useState('');
  const [previewText, setPreviewText] = useState('Sample Text');

  const handleFontUpload = (e) => {
    const file = e.target.files[0];

    // Check if the uploaded file is a valid .ttf file
    if (file && (file.type === 'font/ttf' || file.name.endsWith('.ttf'))) {
      const fontUrl = URL.createObjectURL(file);

      // Generate a custom font name based on the uploaded file name (remove extension)
      const generatedFontName = file.name.replace(/\.[^/.]+$/, '');
      setFontName(generatedFontName);

      // Apply the uploaded font dynamically using a new style element
      const style = document.createElement('style');
      style.innerHTML = `
        @font-face {
          font-family: '${generatedFontName}';
          src: url(${fontUrl}) format('truetype');
        }
      `;
      document.head.appendChild(style);

      // Set the font file URL and font name in the component's state
      setFontFile(fontUrl);
    } else {
      alert('Please upload a valid .ttf font file.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h3>Upload a Custom TTF Font</h3>
      <input type="file" accept=".ttf" onChange={handleFontUpload} />

      <h3>Preview Text</h3>
      <input
        type="text"
        value={previewText}
        onChange={(e) => setPreviewText(e.target.value)}
        style={{ padding: '8px', margin: '10px 0', width: '100%' }}
      />


        <div
          style={{
            fontFamily: fontName,
            fontSize: '20px',
            padding: '10px',
            border: '1px solid #ccc',
          }}
        >
          {previewText}
        </div>

    </div>
  );
};

export default FontUploader;
