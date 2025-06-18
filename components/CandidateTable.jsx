import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './CandidateTable.css';

const CandidateTable = ({ candidates }) => {
  const handleDownloadTable = () => {
    const doc = new jsPDF();

    // Define table headers and rows
    const headers = [['Name', 'Email', 'Contact', 'Resume Link']];
    const rows = candidates.map(candidate => [
      candidate.name || '',
      candidate.email || '',
      candidate.contact || '',
      candidate.resume_link || 'No Link'
    ]);

    // Use autoTable to generate the table
    doc.autoTable({
      head: headers,
      body: rows
    });

    doc.save('shortListed_Candidates.pdf');
  };

  const formatLink = (link) => {
    console.log(`Original link: ${link}`); // Log the original link
    if (!link) {
      console.warn('No link provided.');
      return null; // No link provided
    }
    try {
      // Ensure the link has a valid format
      const url = new URL(link.startsWith('http') ? link : `https://${link}`);
      console.log(`Formatted link: ${url.href}`); // Log the formatted link
      return url.href;
    } catch (error) {
      console.error(`Invalid resume link: ${link}`, error);
      return null; // Return null for invalid links
    }
  };

  return (
    <div className='outerDiv'>
      <h2>Search Results</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Resume Link</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={index}>
              <td>{candidate.name}</td>
              <td>{candidate.email}</td>
              <td>{candidate.contact}</td>
              <td>
                {candidate.resume_link ? (
                  <a
                    href={formatLink(candidate.resume_link)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                ) : (
                  <span>No Resume Available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleDownloadTable} className='downLoadbutton'>Download Table</button>
    </div>
  );
};

export default CandidateTable;
