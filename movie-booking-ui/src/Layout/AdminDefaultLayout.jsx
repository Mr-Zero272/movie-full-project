import { useState } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSideBar/AdminSidebar';

function AdminDefaultLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };
    return (
        <div className="flex">
            <div className="w-2/12">
                <AdminSidebar openSidebar={isSidebarOpen} />
            </div>
            <div className="w-10/12 mt-32 bg-slate-100">
                <AdminHeader />
                <button className="ml-96" onClick={handleToggleSidebar}>
                    Open sidebar
                </button>
                <div className="pl-10">{children}</div>
            </div>
        </div>
    );
}

export default AdminDefaultLayout;
