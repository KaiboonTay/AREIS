import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const StudentForm = () => {
  const [responses, setResponses] = useState({});
  const [checkboxes, setCheckboxes] = useState({
    option1: false,
    option2: false,
    option3: false,
  });
  const [error, setError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const studentIdParam = searchParams.get('studentId');
    setStudentId(studentIdParam);

    // Fetch existing form data from the server
    if (studentIdParam) {
      fetch(`/managestudents/student-form/?studentId=${studentIdParam}`)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            setError(true);
          } else if (data.formSubmitted) {
            setFormSubmitted(true);
          } else {
            setResponses({
              content1: data.content1,
              content2: data.content2,
              content3: data.content3,
              // Add other content responses if necessary
            });
            setLoading(false);
          }
        })
        .catch(() => setError(true));
    } else {
      setError(true);
    }
  }, [searchParams]);

  const handleChange = (question, value) => {
    setResponses((prev) => ({
      ...prev,
      [question]: value,
    }));
    setError(false);
  };

  const handleCheckboxChange = (option) => {
    setCheckboxes((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all the questions have been answered
    const allQuestionsAnswered = Object.keys(responses).length === questions.length;

    if (!allQuestionsAnswered) {
      setError(true);
      return;
    }

    // Submit the form to the server
    fetch('/managestudents/student-form/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: studentId,
        ...responses,
        ...checkboxes
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(true);
        } else {
          setFormSubmitted(true);
        }
      })
      .catch(() => setError(true));
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

  if (loading) return <div>Loading...</div>;
  if (formSubmitted) return <div>You have already submitted this form.</div>;
  if (error) return <div>There was an error loading the form.</div>;

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
                  name={`content${index + 1}`}
                  value={value}
                  onChange={() => handleChange(`content${index + 1}`, value)}
                  className="hidden"
                />
                <span className={`flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer ${responses[`content${index + 1}`] === value ? 'border-blue-500 bg-blue-100 text-blue-600' : 'border-gray-300'} transition duration-200`}>
                  {value}
                </span>
              </label>
            ))}
          </div>
          {error && !responses[`content${index + 1}`] && (
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