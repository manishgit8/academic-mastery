import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import PortalSelection from './components/PortalSelection';
import StaffLogin from './components/StaffLogin';
import StudentLogin from './components/StudentLogin';
import StaffDashboard from './components/StaffDashboard';
import StudentDashboard from './components/StudentDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalSelection />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}