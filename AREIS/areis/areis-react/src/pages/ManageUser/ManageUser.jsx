import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const ManageUser = () => {
    const location = useLocation();
    const isBasePath = location.pathname === '/manageuser';

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.3 } },
        tap: { scale: 0.95 },
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            {isBasePath ? (
                <motion.div
                    className="w-full max-w-2xl text-center"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
            {/* Header Section */}
            <div className="mt-6 mb-6 text-left">
                <h1 className="text-2xl font-bold">Manage Users Portal</h1>
                <p className="text-gray-600 mt-2">
                    Use this portal to add new users or manage user controls.
                </p>
                <hr className="mt-4 mb-6" />
            </div>

                    {/* Centered buttons */}
                    <div className="flex flex-col space-y-6">
                        <motion.div
                            className="w-full h-24 bg-yellow-100 rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:bg-yellow-200 transition"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Link
                                to="add-user"
                                className="text-center text-gray-700 font-semibold text-xl text-decoration-none"
                            >
                                Add User Form →
                            </Link>
                        </motion.div>

                        <motion.div
                            className="w-full h-24 bg-blue-100 rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:bg-blue-200 transition"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Link
                                to="view-edit-user"
                                className="text-center text-gray-700 font-semibold text-xl text-decoration-none"
                            >
                                View and Edit User →
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            ) : (
                <div className="w-full mt-5">
                    <Outlet />
                </div>
            )}
        </div>
    );
};

export default ManageUser;
