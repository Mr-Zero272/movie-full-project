import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, Auth } from '@/layouts';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
    return (
        <>
            <ToastContainer />
            <Routes>
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="/auth/*" element={<Auth />} />
                <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
            </Routes>
        </>
    );
}

export default App;
