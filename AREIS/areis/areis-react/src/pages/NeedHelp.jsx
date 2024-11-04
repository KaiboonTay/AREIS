import React from 'react';

const NeedHelp = () => {
    return (
        <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <div className="w-full max-w-3xl space-y-4">
                {/* Embedded Google Map of PSB Academy with Red Marker */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Location</h3>
                    <p className="text-gray-600 mb-4">
                        You can find us at PSB Academy's campus. Here’s the map to help you navigate.
                    </p>
                    <div className="w-full h-64 rounded-lg overflow-hidden">
                        <iframe
                            title="PSB Academy Location"
                            src="https://www.google.com/maps?q=6+Raffles+Blvd,+%2303-200,+Singapore+039594&hl=en&z=15&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Information</h3>
                    <p className="text-gray-600">
                        <strong>Manager:</strong> Ms Jade
                    </p>
                    <p className="text-gray-600">
                        <strong>Email:</strong> <a href="mailto:jade.ong@newcastle.edu.au" className="text-blue-500 hover:underline">jade.ong@newcastle.edu.au</a>
                    </p>
                    <p className="text-gray-600">
                        <strong>Phone:</strong> <a href="tel:+6560220132" className="text-blue-500 hover:underline">+65 6022 0132</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NeedHelp;
