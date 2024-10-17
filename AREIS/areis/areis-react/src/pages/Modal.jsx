import React from 'react';

const Modal = ({ isOpen, onClose, student }) => {
  if (!isOpen) return null;

  // Function to handle opening a new tab
  const handleViewStudentCopy = () => {
    // Assuming 'student.copyLink' holds the link to the student's copy
    const copyLink = student.copyLink || 'https://example.com/student-copy'; // *EUGENE change this to link*
    window.open(copyLink, '_blank');
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-96 relative">
        {/* Close button */}
        <button className="absolute top-4 right-4" onClick={onClose}>✕</button>

        {/* View Student Copy button */}
        <button 
          className="absolute top-4 left-4 flex items-center bg-gray-100 p-2 rounded-lg shadow"
          onClick={handleViewStudentCopy}
        >
          <span role="img" aria-label="document" className="mr-2">📄</span> 
          View Student Copy
        </button>

        <h4 className="text-xl font-bold mb-4 text-center">Review Action</h4>

        {/* Student details */}
        <div className="text-left">
          <p><strong>Student Name:</strong> {student.name}</p>
          <p><strong>Lecturer:</strong> {student.lecturer}</p>
          <p><strong>Course No:</strong> {student.courseNo}</p>

          <p><strong>Grades:</strong></p>
          <table className="table-auto w-full mb-4">
            <thead>
              <tr>
                <th>Assignment 1</th>
                <th>Assignment 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{student.grades.assignment1}/100</td>
                <td>{student.grades.assignment2}/100</td>
              </tr>
            </tbody>
          </table>

          {/* Action Select */}
          <label htmlFor="action" className="block font-semibold">Action:</label>
          <select id="action" className="w-full mb-4 border p-2 rounded">
            <option value="refer">Refer to</option>
            <option value="flag">Flag for review</option>
          </select>

          {/* Advisor Select */}
          <label htmlFor="advisor" className="block font-semibold">Advisor:</label>
          <select id="advisor" className="w-full mb-4 border p-2 rounded">
            <option value="dr-kim">Dr Kim</option>
            <option value="dr-jones">Dr Jones</option>
          </select>

          {/* Save & Confirm button */}
          <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={onClose}>
            Save & Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
