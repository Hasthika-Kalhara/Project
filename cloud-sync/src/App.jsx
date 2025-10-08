import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Support from './Support.jsx';
import Dashboard from './Dashboard.jsx';
import SalesReport from './SalesReport.jsx';
import ItemWiseReport from './ItemWiseReport.jsx';
import PLReport from './PLReport.jsx';
import DEReport from './DEReport.jsx';
import DebtorReport from './DebtorReport.jsx';
import CreditorReport from './CreditorReport.jsx';
import StockReport from './StockReport.jsx';
import SAReport from './SAReport.jsx';
import QuotationReport from './QuotationReport.jsx';
import ItemReport from './ItemReport.jsx';
import ReorderReport from './ReorderReport.jsx';
import MovingItemReport from './MovingItemReport.jsx';
import NonMovingItemReport from './NonMovingItemReport.jsx';
import AttendsReport from './AttendsReport.jsx';
import ItemRegister from './ItemRegister.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/support" element={<Support />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sales-report" element={<SalesReport />} />
        <Route path="/itemwise-report" element={<ItemWiseReport />} />
        <Route path="/pl-report" element={<PLReport />} />
        <Route path="/de-report" element={<DEReport />} />
        <Route path="/debtor-report" element={<DebtorReport />} />
        <Route path="/creditor-report" element={<CreditorReport />} />
        <Route path="/stock-report" element={<StockReport />} />
        <Route path="/sa-report" element={<SAReport />} />
        <Route path="/q-report" element={<QuotationReport />} />
        <Route path="/item-report" element={<ItemReport />} />
        <Route path="/reorder-report" element={<ReorderReport />} />
        <Route path="/moving-item-report" element={<MovingItemReport />} />
        <Route path="/nonmoving-item-report" element={<NonMovingItemReport />} />
        <Route path="/attends-report" element={<AttendsReport />} />
        <Route path="/item-register" element={<ItemRegister />} />
      </Routes>
    </BrowserRouter>
  );
}