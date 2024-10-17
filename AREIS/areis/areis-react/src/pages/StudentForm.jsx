import React, { useState } from 'react';

const StudentForm = () => {
  const [responses, setResponses] = useState({});
  const [checkboxes, setCheckboxes] = useState({
    option1: false,
    option2: false,
    option3: false,
  });
  const [error, setError] = useState(false); // To track if there's an error

  const handleChange = (question, value) => {
    setResponses((prev) => ({
      ...prev,
      [question]: value,
    }));
    setError(false); // Clear the error when a valid response is selected
  };

  const handleCheckboxChange = (option) => {
    setCheckboxes((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // to check if all the qns have been answered
    const allQuestionsAnswered = Object.keys(responses).length === questions.length;
    
    if (!allQuestionsAnswered) {
      setError(true); // setting errors if all questions are not answered
      return;
    }
    
    console.log(responses, checkboxes); // can send data to backend here
  };

  const questions = [
    "I understand the course materials.",
    "I have sufficient knowledge from previous studies to progress in the course.",
    "I have difficulties with concentrating or staying focused while studying.",
    "I manage my time effectively to meet deadlines and complete assignments.",
    "I have difficulty understanding English.",
    "My overall stress level is high.",
    "I have health issues (physical or mental) that impact my studies.",
    "I have difficulties balancing other commitments (e.g., work, family).",
    "I have financial issues.",
  ];

  const checkboxOptions = [
    "Course Content",
    "Learning Issues",
    "Personal",
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold mb-6 text-center">Student Form</h1>
      {questions.map((question, index) => (
        <div key={index} className="mb-6">
          <label className="block text-lg font-medium mb-2">{question}</label>
          <div className="flex justify-around">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="flex flex-col items-center">
                <input
                  type="radio"
                  name={question}
                  value={value}
                  onChange={() => handleChange(question, value)}
                  className="hidden"
                />
                <span className={`flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer ${responses[question] === value ? 'border-blue-500 bg-blue-100 text-blue-600' : 'border-gray-300'} transition duration-200`}>
                  {value}
                </span>
              </label>
            ))}
          </div>
          {error && !responses[question] && (
            <p className="text-red-500 text-sm mt-1">This question is required.</p>
          )}
        </div>
      ))}

      <h2 className="text-lg font-semibold mb-4">Additional Options:</h2>
      <div className="flex justify-between mb-6">
        {checkboxOptions.map((option, index) => (
          <label key={index} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              onChange={() => handleCheckboxChange(`option${index + 1}`)}
              className="hidden"
            />
            <span className={`flex items-center justify-center w-32 h-10 rounded-lg border-2 cursor-pointer transition duration-200 
              ${checkboxes[`option${index + 1}`] ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-200 border-gray-400'}
              hover:bg-blue-400 hover:text-white`}>
              {option}
            </span>
          </label>
        ))}
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200">
        Submit
      </button>
    </form>
  );
};

export default StudentForm;
