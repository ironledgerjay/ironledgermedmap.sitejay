import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DoctorEnrollment from './pages/DoctorEnrollment';
import Signup from './pages/Signup';
import BookAppointment from './pages/BookAppointment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-doctor" element={<DoctorEnrollment />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
      </Routes>
    </Router>
  );
}

export default App;