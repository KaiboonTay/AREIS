import React, { useState, useRef } from 'react';
import { ArrowUpCircleIcon, ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const UploadCsv = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [duplicateInfo, setDuplicateInfo] = useState({ students: [], courses: [], grades: [] });
    const [newInfo, setNewInfo] = useState({ students: [], courses: [], grades: [] });
    const [expandedSections, setExpandedSections] = useState({
        updates: false,
        duplicates: false,
        duplicateStudents: false,
        duplicateCourses: false,
        duplicateGrades: false,
        newStudents: false,
        newCourses: false,
        newGrades: false,
    });

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) {
            setMessage('Please select a CSV file first.');
            return;
        }
    
        const formData = new FormData();
        formData.append('csv_file', file);
    
        try {
            const response = await fetch('/managedata/api/upload-csv/', {
                method: 'POST',
                body: formData,
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                setMessage(data.error || 'Error uploading file');
                setShowConfirmation(false);  // Close the confirmation popup
                return;
            }
    
            setMessage(data.message || 'File successfully uploaded!');
            setDuplicateInfo({
                students: data.student_duplicates || [],
                courses: data.course_duplicates || [],
                grades: data.grade_duplicates || [],
            });
            setNewInfo({
                students: data.new_students || [],
                courses: data.new_courses || [],
                grades: data.new_grades || [],
            });
    
            setShowSuccessModal(true);
        } catch (error) {
            setMessage('An error occurred during file upload.');
        }
    
        setShowConfirmation(false);  // Close the confirmation popup after handling
    };
    
    // Styling for error messages
    const errorMessageStyle = "mt-4 p-2 bg-red-100 text-red-700 text-center text-sm border border-red-400 rounded-md";
    
    const triggerConfirmation = (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a CSV file first.');
            return;
        }
        setShowConfirmation(true);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setFile(null);
        setDuplicateInfo({ students: [], courses: [], grades: [] });
        setNewInfo({ students: [], courses: [], grades: [] });
        setExpandedSections({
            updates: false,
            duplicates: false,
            duplicateStudents: false,
            duplicateCourses: false,
            duplicateGrades: false,
            newStudents: false,
            newCourses: false,
            newGrades: false,
        });
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
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
            {/* Header Section */}
            <motion.div
                className="mt-6 mb-6 text-left"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <h1 className="text-2xl font-bold">Upload Student Portal</h1>
                <p className="text-gray-600 mt-2">
                    Use this page to upload CSV files containing students. Make sure your file format is .csv before uploading.
                </p>
                <hr className="mt-4 mb-6" />
            </motion.div>

    {/* Main Upload Box */}
    <motion.div
                className="bg-white p-10 rounded-lg shadow-md w-full max-w-2xl"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <h1 className="text-3xl font-bold mb-6 text-center">Upload CSV Files</h1>

                <form encType="multipart/form-data" className="space-y-6">
                    <motion.div
                        className="border-2 border-dashed border-gray-300 p-8 text-center relative"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <ArrowUpCircleIcon className="w-20 h-20 text-blue-500 mx-auto mb-4" />
                        {file ? (
                            <p className="text-gray-600">{file.name}</p>
                        ) : (
                            <p className="text-gray-400">
                                Drag a file here, or{' '}
                                <span className="text-blue-500 underline cursor-pointer">choose a file</span> to upload
                            </p>
                        )}
                        <input
                            type="file"
                            name="csv_file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                    </motion.div>

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

                {showConfirmation && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                            <h2 className="text-xl font-semibold mb-4">Confirm Upload</h2>
                            <p className="mb-6">
                                Are you sure you want to upload the file: <strong>{file.name}</strong>?
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg h-[80vh] flex flex-col">
                            <div className="p-6 flex items-center">
                                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                                <h2 className="text-xl font-semibold">Upload Successful</h2>
                            </div>
                            <p className="px-6 text-gray-700">{message}</p>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto px-6 pb-4 flex-grow">
                                {/* Updates Section */}
                                <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-inner">
                                    <div
                                        onClick={() => toggleSection('updates')}
                                        className="cursor-pointer flex items-center justify-between"
                                    >
                                        <span className="font-semibold text-gray-800">Updates</span>
                                        <div className="flex items-center">
                                            <span className="bg-green-500 text-white rounded-full px-3 py-1 text-xs font-bold mr-2">
                                                {newInfo.students.length + newInfo.courses.length + newInfo.grades.length}
                                            </span>
                                            <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                                        </div>
                                    </div>
                                    {expandedSections.updates && (
                                        <div className="mt-2 ml-4 text-sm text-gray-700">
                                            <div className="mt-2">
                                                <div
                                                    onClick={() => toggleSection('newStudents')}
                                                    className="cursor-pointer font-semibold flex items-center justify-between"
                                                >
                                                    <span>New Students ({newInfo.students.length})</span>
                                                    <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                                </div>
                                                {expandedSections.newStudents && (
                                                    <ul className="list-disc list-inside ml-4 text-gray-600">
                                                        {newInfo.students.map((student, index) => (
                                                            <li key={index}>{student}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                <div
                                                    onClick={() => toggleSection('newCourses')}
                                                    className="cursor-pointer font-semibold flex items-center justify-between"
                                                >
                                                    <span>New Courses ({newInfo.courses.length})</span>
                                                    <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                                </div>
                                                {expandedSections.newCourses && (
                                                    <ul className="list-disc list-inside ml-4 text-gray-600">
                                                        {newInfo.courses.map((course, index) => (
                                                            <li key={index}>{course}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                <div
                                                    onClick={() => toggleSection('newGrades')}
                                                    className="cursor-pointer font-semibold flex items-center justify-between"
                                                >
                                                    <span>New Grades ({newInfo.grades.length})</span>
                                                    <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                                </div>
                                                {expandedSections.newGrades && (
                                                    <ul className="list-disc list-inside ml-4 text-gray-600">
                                                        {newInfo.grades.map((grade, index) => (
                                                            <li key={index}>{grade}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Duplicates Section */}
                                <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-inner">
                                    <div
                                        onClick={() => toggleSection('duplicates')}
                                        className="cursor-pointer flex items-center justify-between"
                                    >
                                        <span className="font-semibold text-gray-800">Duplicates</span>
                                        <div className="flex items-center">
                                            <span className="bg-red-500 text-white rounded-full px-3 py-1 text-xs font-bold mr-2">
                                                {duplicateInfo.students.length + duplicateInfo.courses.length + duplicateInfo.grades.length}
                                            </span>
                                            <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                                        </div>
                                    </div>
                                    {expandedSections.duplicates && (
                                        <div className="mt-2 ml-4 text-sm text-gray-700">
                                            <div className="mt-2">
                                                <div
                                                    onClick={() => toggleSection('duplicateStudents')}
                                                    className="cursor-pointer font-semibold flex items-center justify-between"
                                                >
                                                    <span>Duplicate Students ({duplicateInfo.students.length})</span>
                                                    <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                                </div>
                                                {expandedSections.duplicateStudents && (
                                                    <ul className="list-disc list-inside ml-4 text-gray-600">
                                                        {duplicateInfo.students.map((student, index) => (
                                                            <li key={index}>{student}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                <div
                                                    onClick={() => toggleSection('duplicateCourses')}
                                                    className="cursor-pointer font-semibold flex items-center justify-between"
                                                >
                                                    <span>Duplicate Courses ({duplicateInfo.courses.length})</span>
                                                    <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                                </div>
                                                {expandedSections.duplicateCourses && (
                                                    <ul className="list-disc list-inside ml-4 text-gray-600">
                                                        {duplicateInfo.courses.map((course, index) => (
                                                            <li key={index}>{course}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                <div
                                                    onClick={() => toggleSection('duplicateGrades')}
                                                    className="cursor-pointer font-semibold flex items-center justify-between"
                                                >
                                                    <span>Duplicate Grades ({duplicateInfo.grades.length})</span>
                                                    <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                                </div>
                                                {expandedSections.duplicateGrades && (
                                                    <ul className="list-disc list-inside ml-4 text-gray-600">
                                                        {duplicateInfo.grades.map((grade, index) => (
                                                            <li key={index}>{grade}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Fixed OK Button */}
                            <div className="p-6 bg-gray-50 border-t border-gray-200">
                                <button
                                    onClick={closeSuccessModal}
                                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {message && (
                    <div className={message === "Please upload a CSV file only." ? errorMessageStyle : "mt-4 p-2 bg-gray-100 text-center text-sm text-gray-700 border rounded-md"}>
                        {message}
                    </div>
                )}
            </div>
    );
};

export default UploadCsv;