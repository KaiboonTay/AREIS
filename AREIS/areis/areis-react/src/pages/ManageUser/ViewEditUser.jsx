import React, { useState } from 'react';
import { FaEllipsisH, FaTrashAlt } from 'react-icons/fa';

const ViewEditUser = () => {
    // Sample user data (replace with actual data from backend)
    const [users, setUsers] = useState([
        { id: 1, username: 'john_doe', email: 'john@example.com', role: 'Lecturer' },
        { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'TA' },
        { id: 3, username: 'sam_lee', email: 'sam@example.com', role: 'Lecturer' },
    ]);

    const [showConfirm, setShowConfirm] = useState({ visible: false, action: '', user: null });
    const [editUser, setEditUser] = useState(null); // State for editing user
    const [showSaveConfirm, setShowSaveConfirm] = useState(false); // State for save confirmation

    // Handle confirmation for delete action
    const handleConfirm = (action, user) => {
        setShowConfirm({ visible: true, action, user });
    };

    // Confirm delete action
    const confirmAction = () => {
        if (showConfirm.action === 'delete') {
            setUsers(users.filter(u => u.id !== showConfirm.user.id));
        }
        setShowConfirm({ visible: false, action: '', user: null });
    };

    // Handle edit action
    const handleEdit = (user) => {
        setEditUser(user); // Set the selected user for editing
    };

    // Handle change for edit form inputs
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditUser({ ...editUser, [name]: value });
    };

    // Handle save action for edit form
    const handleSave = () => {
        setShowSaveConfirm(true); // Show save confirmation
    };

    // Confirm save action
    const confirmSave = () => {
        setUsers(users.map(u => (u.id === editUser.id ? editUser : u)));
        setEditUser(null); // Close the edit form after saving
        setShowSaveConfirm(false); // Close the save confirmation
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-6">View and Edit User</h2>
            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="min-w-full bg-white shadow-lg rounded-lg border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="py-3 px-6 text-left align-middle font-semibold">Username</th>
                            <th className="py-3 px-6 text-left align-middle font-semibold">Email</th>
                            <th className="py-3 px-6 text-left align-middle font-semibold">Role</th>
                            <th className="py-3 px-6 text-center align-middle font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left align-middle">{user.username}</td>
                                <td className="py-3 px-6 text-left align-middle">{user.email}</td>
                                <td className="py-3 px-6 text-left align-middle">{user.role}</td>
                                <td className="py-3 px-6 text-center align-middle">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-gray-500 hover:text-gray-700 transition mr-4"
                                    >
                                        <FaEllipsisH className="text-lg" />
                                    </button>
                                    <button
                                        onClick={() => handleConfirm('delete', user)}
                                        className="text-red-500 hover:text-red-700 transition"
                                    >
                                        <FaTrashAlt className="text-lg" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Popup for Delete */}
            {showConfirm.visible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                        <p className="mb-4 text-lg font-semibold text-gray-800">Delete User</p>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete user{' '}
                            <span className="font-bold">{showConfirm.user.username}</span>?
                        </p>
                        <div className="flex justify-around">
                            <button
                                onClick={confirmAction}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowConfirm({ visible: false, action: '', user: null })}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Form Overlay */}
            {editUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4 text-center">Edit User</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={editUser.username}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editUser.email}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium">Role</label>
                                <select
                                    name="role"
                                    value={editUser.role}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="Lecturer">Lecturer</option>
                                    <option value="TA">Teaching Assistant</option>
                                </select>
                            </div>
                            <div className="flex justify-around mt-6">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditUser(null)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Popup for Save */}
            {showSaveConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                        <p className="mb-4 text-lg font-semibold text-gray-800">Save Changes</p>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to save changes for{' '}
                            <span className="font-bold">{editUser.username}</span>?
                        </p>
                        <div className="flex justify-around">
                            <button
                                onClick={confirmSave}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowSaveConfirm(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewEditUser;
