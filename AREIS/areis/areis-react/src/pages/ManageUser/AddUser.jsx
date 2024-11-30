import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/users/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    email: formData.email,
                    contactNumber: formData.contactNumber,
                    role: formData.role,
                    courses: formData.courses,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`User successfully added! Welcome, ${data.user.username}`);
                navigate('/manageuser');
            } else {
                alert(`Error: ${data.message || 'Failed to add user'}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    const handleCloseForm = () => {
        navigate('/manageuser');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <div className="relative w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-black">
                <button
                    onClick={handleCloseForm}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    ✖
                </button>
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
            </div>
        </div>
    );
};

export default AddUser;