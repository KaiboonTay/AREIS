import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const ManageUser = () => {
    const location = useLocation(); // Get the current location to check the path

    // Check if the current path is exactly /manageuser
    const isBasePath = location.pathname === '/manageuser';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white-100 text-center">
            {isBasePath ? (
                <div className="flex flex-col items-center space-y-6">
                    <h1 className="text-2xl font-bold">Manage User Page</h1>
                    
                    <div className="flex space-x-5">
                        {/* Link to navigate to Add User page */}
                        <Link
                            to="add-user"
                            className="w-48 h-40 bg-yellow-100 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-yellow-200 transition"
                        >
                            <span className="font-semibold text-lg">Add User Form</span>
                            <span className="text-xl mt-2">→</span>
                        </Link>

                        {/* Link to navigate to View and Edit User page */}
                        <Link
                            to="view-edit-user"
                            className="w-48 h-40 bg-blue-100 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-blue-200 transition"
                        >
                            <span className="font-semibold text-lg">View and Edit User</span>
                            <span className="text-xl mt-2">→</span>
                        </Link>
                    </div>
                </div>
            ) : (
                // Nested page rendering here
                <div className="w-full mt-5">
                    <Outlet /> {/* Renders AddUser or ViewEditUser component based on nested route */}
                </div>
            )}
        </div>
    );
};

export default ManageUser;
