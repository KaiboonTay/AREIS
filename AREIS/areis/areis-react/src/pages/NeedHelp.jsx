import React from 'react';

const NeedHelp = () => {
    return (
        <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <div className="w-full max-w-3xl space-y-4">
                {/* Embedded Google Map of PSB Academy */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Location</h3>
                    <p className="text-gray-600 mb-4">
                        You can find us at PSB Academy's campus. Here’s the map to help you navigate.
                    </p>
                    <div className="w-full h-64 rounded-lg overflow-hidden">
                        <iframe
                            title="PSB Academy Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.1871216866!2d103.84924676267228!3d1.3005264086418894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19b8f1e2a983%3A0xe22f51f0844c128f!2sPSB%20Academy!5e0!3m2!1sen!2ssg!4v1681414123456!5m2!1sen!2ssg"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
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
                        <strong>Email:</strong> <a href="mailto:johndoe@example.com" className="text-blue-500 hover:underline">jade.ong@newcastle.edu.au</a>
                    </p>
                    <p className="text-gray-600">
                        <strong>Phone:</strong> <a href="tel:+1234567890" className="text-blue-500 hover:underline">+65 6022 0132</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NeedHelp;
