import React, { useState } from 'react';
import { ArrowUpCircleIcon } from '@heroicons/react/24/outline'; 

const UploadCsv = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false); // State for upload confirmation
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success message modal

    // Handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle file upload
    const handleSubmit = async () => {
        if (!file) {
            setMessage('Please select a CSV file first');
            return;
        }

        const formData = new FormData();
        formData.append('csv_file', file);

        try {
            // Send file to Django API
            const response = await fetch('/managedata/api/upload-csv/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error uploading file');
            }

            const data = await response.json(); // Process response if needed
            setMessage('File successfully uploaded!');
            setShowSuccessModal(true); // Show success modal
        } catch (error) {
            setMessage('Error uploading file');
        }

        // Close confirmation modal
        setShowConfirmation(false);
    };

    // Trigger upload confirmation modal
    const triggerConfirmation = (e) => {
        e.preventDefault(); // Prevent default form behavior
        if (!file) {
            setMessage('Please select a CSV file first');
            return;
        }
        setShowConfirmation(true); // Show confirmation modal
    };

    // Close success modal
    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setFile(null); // Optionally reset the file after success
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-2xl"> {/* Adjusted width */}
            <h1 className="text-3xl font-bold mb-6 text-center">Upload CSV Files</h1> {/* Centered header */}

                <form encType="multipart/form-data" className="space-y-6"> {/* Increased spacing */}
                    <div className="border-2 border-dashed border-gray-300 p-8 text-center relative"> {/* Larger padding */}
                        <ArrowUpCircleIcon className="w-20 h-20 text-blue-500 mx-auto mb-4" /> {/* Increased icon size */}
                        {file ? (
                            <p className="text-gray-600">{file.name}</p>
                        ) : (
                            <p className="text-gray-400">Drag a file here, or <span className="text-blue-500 underline cursor-pointer">choose a file</span> to upload</p>
                        )}
                        <input
                            type="file"
                            name="csv_file"
                            onChange={handleFileChange}
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                    </div>

                    <button
                        onClick={triggerConfirmation}
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Upload File
                    </button>
                </form>

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
        </div>
    );
};

export default UploadCsv;
