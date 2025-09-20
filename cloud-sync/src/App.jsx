import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Support from './Support.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </BrowserRouter>
  );
}