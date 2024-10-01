import React, { useState } from 'react';


const SendEmail = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/send-email/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const result = await response.json();
        if (response.ok) {
            setMessage('Email sent successfully');
        } else {
            setMessage(`Failed to send email: ${result.error}`);
        }
    };

    return (
        <div>
            <h1>Send Email</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email Address:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Send</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SendEmail;