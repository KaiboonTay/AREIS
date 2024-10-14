import React, { useState } from 'react';

const UploadCsv = () => {
    // State to store the selected file
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    // Handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        if (!file) {
            setMessage('Please select a CSV file first');
            return;
        }

        // Create form data
        const formData = new FormData();
        formData.append('csv_file', file);

        try {
            // Make the request to your Django backend (adjust URL as needed)
            const response = await fetch('/managedata/api/upload-csv/', {
                method: 'POST',
                body: formData,
                headers: {
                    // 'Content-Type': 'multipart/form-data' is not needed here; fetch will set it automatically.
                },
            });

            if (!response.ok) {
                throw new Error('Error uploading file');
            }

            const data = await response.json(); // You can handle the response data if needed
            setMessage('File successfully uploaded!');
        } catch (error) {
            setMessage('Error uploading file');
        }
    };

    return (
        <div>
            <h1>Upload CSV File</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Select File:</label>
                    <input type="file" name="csv_file" onChange={handleFileChange} />
                </div>
                <button type="submit">Upload File</button>
            </form>

            {message && (
                <div>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
};

export default UploadCsv;