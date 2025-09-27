import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Support from './Support.jsx';
import Dashboard from './Dashboard.jsx';
import SalesReport from './SalesReport.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/support" element={<Support />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sales-report" element={<SalesReport />} />
      </Routes>
    </BrowserRouter>
  );
}