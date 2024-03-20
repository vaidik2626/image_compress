import axios from 'axios';

const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:5000/compress', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Set the content type header
      }
    });

    console.log('File uploaded successfully:', response.data);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

export default uploadFile;
