
import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/compress', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);
      setCompressedImage(response.data.path);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = 'compressed_image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {compressedImage && (
        <div>
          <img src={compressedImage} alt="Compressed" />
          <button onClick={handleDownload}>Download</button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
