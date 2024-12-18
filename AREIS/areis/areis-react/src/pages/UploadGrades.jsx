import React, { useState } from 'react';
import { ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const UploadGrades = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false); // For upload confirmation
    const [showSuccessModal, setShowSuccessModal] = useState(false); // For success message

    // Handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!file) {
            setMessage('Please select a CSV file first');
            return;
        }

        // Create form data
        const formData = new FormData();
        formData.append('csv_file', file);

        try {
            // Send the file to the Django backend
            const response = await fetch('/managedata/api/upload-grades/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error uploading file');
            }

            setMessage('File successfully uploaded!');
            setShowSuccessModal(true); // Show success modal
        } catch (error) {
            setMessage('Error uploading file');
        }

        setShowConfirmation(false); // Close confirmation modal
    };

    // Open confirmation modal
    const triggerConfirmation = (e) => {
        e.preventDefault(); // Prevent default behavior
        if (!file) {
            setMessage('Please select a CSV file first');
            return;
        }
        setShowConfirmation(true); // Show confirmation modal
    };

    // Close success modal
    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setFile(null); // Optionally reset file after success
    };

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
            <motion.div
            className="min-h-screen bg-gray-50 flex flex-col items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <div className="mt-6 mb-6 text-left">
                <h1 className="text-2xl font-bold">Upload Grades Portal</h1>
                <p className="text-gray-600 mt-2">
                    Use this page to upload CSV files containing grades. Make sure your file format is .csv before uploading.
                </p>
                <p className="text-gray-600 mt-2">
  This will:
</p>
<ul className="text-gray-600 list-disc list-inside ml-4">
  <li>Update the grades</li>
</ul>
                <hr className="mt-4 mb-6" />
            </div>

            <motion.div
                className="bg-white p-10 rounded-lg shadow-md w-full max-w-2xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h1 className="text-3xl font-bold mb-6 text-center">Upload Grades CSV</h1>

                <form encType="multipart/form-data" className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 p-8 text-center relative">
                        <ArrowUpCircleIcon className="w-20 h-20 text-blue-500 mx-auto mb-4" />
                        {file ? (
                            <p className="text-gray-600">{file.name}</p>
                        ) : (
                            <p className="text-gray-400">
                                Drag a file here, or <span className="text-blue-500 underline cursor-pointer">choose a file</span> to upload
                            </p>
                        )}
                        <input
                            type="file"
                            name="csv_file"
                            onChange={handleFileChange}
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                    </div>

                    <motion.button
                        onClick={triggerConfirmation}
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Upload File
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>

                {/* Confirmation Modal */}
                {showConfirmation && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                            <h2 className="text-xl font-semibold mb-4">Confirm Upload</h2>
                            <p className="mb-6">Are you sure you want to upload the file: <strong>{file.name}</strong>?</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowConfirmation(false)} // Close modal
                                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit} // Confirm upload
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                            <h2 className="text-xl font-semibold mb-4">Upload Successful</h2>
                            <p>Your file <strong>{file?.name}</strong> was successfully uploaded!</p>
                            <button
                                onClick={closeSuccessModal} // Close success modal
                                className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}

                {message && (
                    <div className="mt-4 p-2 bg-gray-100 text-center text-sm text-gray-700 border rounded-md">
                        {message}
                    </div>
                )}
            </div>
    );
};

export default UploadGrades;
