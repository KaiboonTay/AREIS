import React, { useState, useEffect } from 'react';

const StudentForm = () => {
    const [formData, setFormData] = useState({
        studentId: '',
        content1: 0,
        content2: 0,
        content3: 0,
        content4: 0,
        content5: 0,
        content6: 0,
        content7: 0,
        content8: 0,
        content9: 0,
        content10: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const studentId = urlParams.get('studentId');

        if (studentId) {
            setFormData(prevData => ({ ...prevData, studentId }));

            // Fetch existing form data for this studentId
            fetch(`http://localhost:8000/managedata/student-form/?studentId=${studentId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setFormData(data);  // Update form data with the data from the server
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching form data:", err);
                    setError('Failed to load form data.');
                    setLoading(false);
                });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {

            const response = await fetch(`http://localhost:8000/managedata/student-form/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const result = await response.json();
            if (response.ok) {
                alert('Form submitted successfully');
            } else {
                alert(`Failed to submit form: ${result.error}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the form.');
        }
    };
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <form onSubmit={handleSubmit}>
            <h1>Student Response Form</h1>
            <label>
                Student ID:
                <input type="text" name="studentId" value={formData.studentId} readOnly />
            </label>
            {[...Array(10)].map((_, i) => (
                <label key={i}>
                    Content {i + 1}:
                    <input
                        type="number"
                        name={`content${i + 1}`}
                        value={formData[`content${i + 1}`]}
                        onChange={handleChange}
                        required
                    />
                </label>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
};

export default StudentForm;
