import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './Table.css';

const Table = ({ candidates, clearAll }) => {
  const [isClearing, setIsClearing] = useState(false);
  const [fileName, setFileName] = useState(''); // State for the file name
  const [showInput, setShowInput] = useState(false); // State to show input for file name
  const navigate = useNavigate();

  const handleDownloadTable = () => {
    setShowInput(true); // Show the input for the file name
  };

  const handleConfirmDownload = () => {
    const doc = new jsPDF();

    // Define table headers and rows
    const headers = [['Name', 'Email', 'Contact', 'Skills', 'Education']];
    const rows = candidates.map(candidate => [
      candidate.name || '',
      candidate.email || '',
      candidate.contact || '',
      candidate.skills ? candidate.skills.join(', ') : '',
      candidate.education || '',
    ]);

    // Use autoTable to generate the table
    doc.autoTable({
      head: headers,
      body: rows,
    });

    doc.save(`${fileName || 'candidates'}.pdf`); 
    setShowInput(false); // Hide the input after download
    setFileName(''); // Reset file name
  };

  const handleClearAll = () => {
    setIsClearing(true);

    // Simulate clearing process with a timeout
    setTimeout(() => {
      clearAll(); // Call the parent's clearAll function to remove candidates
      setIsClearing(false);

      // Automatically navigate to the upload page after clearing
      navigate('/upload');
    }, 200); 
  };

  return (
    <div className='tableContainer'>
      {isClearing && (
        <div className="loadingOverlay">
          <p>Clearing data...</p>
          <div className="spinner"></div>
        </div>
      )}

      {/* Show the input for the file name if the user clicks download */}
      {showInput && (
        <div className="backdrop">
          <div className="inputModal">
            <label htmlFor="fileName">Enter file name:</label>
            <input
              type="text"
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="candidates"
            />
            <button onClick={handleConfirmDownload}>Confirm Download</button>
            <button onClick={() => setShowInput(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={`table ${isClearing ? 'blurred' : ''}`}>
        <h2>Uploaded Candidates</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact No.</th>
              <th>Email</th>
              <th>Skills</th>
              <th>Education</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={index}>
                <td>{candidate.name}</td>
                <td>{candidate.contact}</td>
                <td>{candidate.email}</td>
                <td>{candidate.skills.join(', ')}</td>
                <td>{candidate.education}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={handleDownloadTable} className='downLoadbutton'>Download Table</button>
        <button onClick={handleClearAll} className='clearAllbutton'>Clear All</button>
      </div>
    </div>
  );
};

export default Table;
