import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Herosection from './components/Herosection';
import Feature from './components/Feature';

export const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.data.message) {
        setMessage(response.data.message);
        const filename = response.data.filename;
        const compressedImageUrl = `http://localhost:5000/download/${filename}`;
        setCompressedImageUrl(compressedImageUrl);
      } else {
        setMessage('Failed to upload and compress the image.');
      }
    } catch (error) {
      setMessage('An error occurred while uploading and compressing the file.');
      console.error('Error uploading and compressing file:', error);
    }
  };

  const [compressedImageUrl, setCompressedImageUrl] = useState('');

  const handleDownload = async () => {
    window.open(compressedImageUrl, '_blank');
  };


  return (
    <div>
      <Navbar />
      <Herosection />
      <Feature />
      <h1>Upload Image</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
      {compressedImageUrl && <img src={compressedImageUrl} alt="Compressed" />}
      {compressedImageUrl && <button onClick={handleDownload}>Download Compressed Image</button>}
    </div>
  );
}
export default App;

