import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
                <div className="w-8 h-8 border-4 border-[#EFE223] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return !isAuthenticated ? <Outlet /> : <Navigate to="/ai" replace />;
};

export default PublicRoute;
