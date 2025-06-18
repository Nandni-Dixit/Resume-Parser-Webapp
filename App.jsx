import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import NavBar from './components/NavBar';
import HomePage from './components/Home'; 
import FileUpload from './components/FileUpload';
import Table from './components/Table';
import CandidateTable from './components/CandidateTable';
import SignIn from './components/SignIn'; // Import SignIn component
import SignUp from './components/SignUp'; // Import SignUp component
import AuthProvider from './components/AuthProvider'; // Import AuthProvider
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

function App() {
  const [candidates, setCandidates] = useState([]);

  const clearAll = async () => {
    try {
      const response = await fetch('http://localhost:5000/clear', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear data');
      }

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <AuthProvider>
      <Router>
        <NavBar onSearch={setCandidates} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/SignUp" element={<SignUp />} /> 
          <Route path="/SignIn" element={<SignIn />} />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <FileUpload onFilesUploaded={setCandidates} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/table" 
            element={
              <ProtectedRoute>
                <Table candidates={candidates} clearAll={clearAll} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute>
                <CandidateTable candidates={candidates} />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
