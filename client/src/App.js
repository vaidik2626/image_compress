
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('location', 'D:/College/sem 6/sgp/image_compress/input');
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/compress', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Compression successful:', response.data);
      // Optionally, display a success message to the user
    } catch (error) {
      console.error('Error compressing image:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div>
      <Navbar/>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Compress</button>
    </div>
  );
};

export default ImageUploader;



/*import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';

const ImageUploader = () => {
  //const [selectedFile, setSelectedFile] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [file, setFile] = useState();
    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
    }

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/compress', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Set the content type header
      }
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
      <Navbar/>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload} className='bg-black text-white'>Upload</button>
      <div className='width:150px height:150px'>
          <img src={file} />
      </div>
      <p>Compressed Image</p>
      {compressedImage && (
        <div>
          <img src={compressedImage} alt="Compressed" />
          <button onClick={handleDownload}>Download</button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;*/
