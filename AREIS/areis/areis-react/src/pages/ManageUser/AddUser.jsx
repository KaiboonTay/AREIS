import React, { useState } from 'react';

const AddUser = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        contactNumber: '',
        role: 'lecturer',
        courses: '',
    });

    const [showConfirm, setShowConfirm] = useState(false); // Confirmation popup state

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true); // Show confirmation popup
    };

    // Confirm submission action
    const confirmSubmit = () => {
        setShowConfirm(false);
        // Here you would handle the actual submission logic (e.g., send data to a server)
        alert('User has been successfully added!');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-black">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Add New User Form</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-gray-700 font-medium">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    {/* Confirm Password */}
                    <div>
                        <label className="block text-gray-700 font-medium">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    {/* Contact Number */}
                    <div>
                        <label className="block text-gray-700 font-medium">Contact Number</label>
                        <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    {/* Role */}
                    <div>
                        <label className="block text-gray-700 font-medium">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="lecturer">Lecturer</option>
                            <option value="TA">Teaching Assistant (TA)</option>
                        </select>
                    </div>
                    {/* Courses */}
                    <div>
                        <label className="block text-gray-700 font-medium">Courses</label>
                        <input
                            type="text"
                            name="courses"
                            value={formData.courses}
                            onChange={handleChange}
                            placeholder="Enter courses separated by commas"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition duration-300"
                        >
                            Submit
                        </button>
                    </div>
                </form>

                {/* Confirmation Popup */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                            <p className="mb-4 text-lg font-semibold text-gray-800">Confirm Submission</p>
                            <p className="text-gray-600 mb-6">Are you sure you want to submit this form?</p>
                            <div className="flex justify-around">
                                <button
                                    onClick={confirmSubmit}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddUser;
