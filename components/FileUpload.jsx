import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FileUpload.css'; 

const FileUpload = ({ onFilesUploaded }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate(); 

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles([...files, ...uploadedFiles]); 
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    files.forEach(file => formData.append('files[]', file));

    setIsLoading(true); // Set loading to true before starting upload

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      setIsLoading(false); // Set loading to false once upload completes
      onFilesUploaded(data);  // Pass data to parent (App) to store candidates
      navigate('/table'); // Navigate to the table page
    })
    .catch(error => {
      setIsLoading(false); // Handle error case and stop loading
      console.error("Error uploading files", error);
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: Smooth scrolling effect
    });
  };
  // Function to handle file removal
  const handleFileRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Loading overlay that stays clear when loading */}
    {isLoading && (
      <div className="loadingOverlay">
        <p>Generating table...</p>
        <div className="spinner"></div> {/* Spinner can be added */}
      </div>
    )};

    {/* This is the blurred section */}
    <div className={`mainContainer ${isLoading ? 'blurred' : ''}`}> 
      
      <div className='heading'>Upload Files</div>
  
      {/* Dropzone for file upload */}
      <div className='outerZone'>
        <div className="dropzone" onDragOver={handleDragOver} onDrop={handleDrop}>
          <label htmlFor="fileInput" className="dropzone-label">
            <img src='../src/assets/upload_icon.png' className='upload_icon' alt="Upload Icon" />
            <p>Drag & Drop files here or click to select</p>
            <input type="file" multiple onChange={handleFileChange} id="fileInput" className="hiddenInput" />
          </label>
        </div>
      </div>
  
      {/* Display selected files */}
      {files.length > 0 && (
        <div className="selected-files">
          <h4>Selected Files:</h4>
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <span>{file.name}</span>
              <button className="remove-file" onClick={() => handleFileRemove(index)}>
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
  
      {/* Upload button */}
      {files.length > 0 && (
        <button className="uploadButton" onClick={handleUpload}>
          Upload
        </button>
      )}
  
      {/* Information Section */}
      <div className='information'>
        <div className='info-left'>
          Upload PDF/Docx files to create a candidate table. It's easy to parse resumes with ResumeParser. No watermarks and no file size limits.
        </div>
        <div className='info-right'>
          <ul>
            <li className='listOne'><img src='../src/assets/tick.jpg' className='tick' alt="Tick" /> Upload or drag & drop resumes—quick and easy!</li>
            <li><img src='../src/assets/tick.jpg' className='tick' alt="Tick" /> Parse PDF, DOC, DOCX files across platforms.</li>
            <li className='listThree'><img src='../src/assets/tick.jpg' className='tick' alt="Tick" /> Instantly extract and display candidate details.</li>
            <li className='listFour'><img src='../src/assets/tick.jpg' className='tick' alt="Tick" /> Download and filter candidate data in seconds.</li>
          </ul>
        </div>
      </div>
    </div>
  
    
  </div>
  );
};

export default FileUpload;
