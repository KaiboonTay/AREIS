import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, Sector, ResponsiveContainer } from 'recharts';

// Function to render the active sector with an expanded radius
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 18;
  const ey = my;

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      {/* Display only the percentage */}
      <text x={ex + (cos >= 0 ? 12 : -12)} y={ey + 12} textAnchor={cos >= 0 ? 'start' : 'end'} fill="#999">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};


const Dashboard = () => {
  const [activeIndex1, setActiveIndex1] = useState(0); // for left piechart (flagged)
  const [activeIndex2, setActiveIndex2] = useState(0); // for right piechart (cases)
  const [data, setData] = useState({ casecategory: [], studentcases: [], studentgrades: [] });
  const colors = ['#00C49F', '#0088FE', '#FFBB28'];
  const [expandedSection, setExpandedSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]); // State for student history
  const onPieEnter1 = (_, index) => setActiveIndex1(index);
  const onPieEnter2 = (_, index) => setActiveIndex2(index);

 // const cardsData = [
   // { title: 'Course Content', chartData: [{ name: 'Completed', value: 32, color: '#FF5A5A' }] },
   // { title: 'Learning Issues', chartData: [{ name: 'Completed', value: 22, color: '#3498db' }] },
   // { title: 'Personal', chartData: [{ name: 'Completed', value: 15, color: '#f39c12' }] }
 // ];

 const cardsData = data.casecategory.map((category, index) => ({
  title: category.categoryname,
  id: category.categoryid,
  chartData: [
    {
      name: 'Completed',
      value: data.studentcases.filter((studentcase) => studentcase.categoryid === category.categoryid).length,
      color: colors[index % colors.length]
    }
  ]
}));

  useEffect(() => {
    fetch('/dashboard/')
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const sortedCards = [...cardsData].sort((a, b) => (a.title === expandedSection ? -1 : b.title === expandedSection ? 1 : 0));

  const handleExpand = (section) => {
    if (isModalOpen) return; // if pop up window is open, do not collapse the section
    setExpandedSection((prevSection) => (prevSection === section ? null : section));
  };


  // Function to handle opening the modal
  const handleModalOpen = (studentcase, cardTitle) => {
    if (!studentcase) {
      console.error("Student case is missing.");
      return;
    }
  
    // Find the matching student
    const student = data.students.find(
      student => student.studentid === studentcase.studentid
    );
  
    setSelectedStudent({
      studentid: studentcase.studentid,
      courseid: studentcase.courseid,
      formid: studentcase.formid,
      caseid: studentcase.caseid,
      lastname: student?.lastname || "N/A",
      firstname: student?.firstname || "N/A",
    });
  
    setIsModalOpen(true);
    setExpandedSection(cardTitle);
  
    console.log(
      "Fetching history for student:",
      studentcase.studentid,
      "course:",
      studentcase.courseid
    );
  
    // Fetch student history
    fetch(`/api/student-history/${studentcase.studentid}/${studentcase.courseid}/`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Received history data:", data);
        if (data.student_history) {
          setStudentHistory(data.student_history);
        } else {
          console.error("No student_history found in response:", data);
          setStudentHistory([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch student history:", error);
        setStudentHistory([]);
      });
  };
  

  // Function to handle closing the modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setStudentHistory([]); // Clear student history on close
  };

  // Function to handle the studentviewcopy
const handleViewStudentCopy = async (studentId, formId) => {
  try {
    console.log(`Attempting to fetch form data for studentId: ${studentId}, formId: ${formId}`);

    // Make the fetch request
    const response = await fetch(`/api/student-form-view/?studentId=${studentId}&formId=${formId}`);
    console.log("Fetch request made. Checking response status...");

    // Check response status
    if (!response.ok) {
      throw new Error(`Failed to fetch form data: ${response.status} - ${response.statusText}`);
    }

    // Check Content-Type header
    const contentType = response.headers.get("content-type");
    console.log("Content-Type received:", contentType);
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid JSON response. Expected application/json but received something else.");
      const rawResponseText = await response.text();  // Get the raw text of the response for debugging
      console.error("Raw response text:", rawResponseText);
      throw new Error("Invalid JSON response.");
    }

    // Parse JSON response
    const formData = await response.json();
    console.log("Received Form Data:", formData);

    // Open a new window and write the form data
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      console.error("Failed to open new tab/window, possibly blocked by the browser.");
      return;
    }

    // Write the HTML content to the new window
    newWindow.document.write(`
      <html>
        <head>
          <title>Student Form</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>Student Form for ${formData.student_name}</h1>
          <p><strong>Flagged Course:</strong> ${formData.flagged_course}</p>
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(formData.responses)
                .map(([question, response]) => `<tr><td>${question}</td><td>${response}</td></tr>`)
                .join("")}
            </tbody>
          </table>
          <h2>Student's Selected Main Issue</h2>
          <ul>
            ${formData.checkbox_options.map((option) => `<li>${option}</li>`).join("")}
          </ul>
           <h2>System's recommended Action</h2>
          <ul>
            ${formData.checkbox_options.map((option) => `<li>${option}</li>`).join("")}
          </ul>
        </body>
      </html>
    `);
    newWindow.document.close();
  } catch (error) {
    // Log additional debugging information
    console.error("Error displaying student form:", error);

    if (error instanceof SyntaxError) {
      console.error("This error is likely due to a malformed JSON response.");
    } else {
      console.error("This error might be due to a network issue or incorrect response format.");
    }
  }
};

const saveReferredAction = async () => {
  if (!selectedStudent || !selectedAction) {
    console.error("Student ID or selected action is missing.");
    return;
  }

  try {
    const response = await fetch('/api/update-studentcase-referred/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        case_id: selectedStudent.caseid,
        referred: selectedAction,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data.message);

    // Update the UI dynamically
    setSelectedStudent((prev) => ({
      ...prev,
      referred: data.referred || "N/A", // Handle null values dynamically
    }));

    alert("Refer to action has been set");
    setIsModalOpen(false);
  } catch (error) {
    console.error("Failed to save referred action:", error);
  }
};
  

  const flagColors = ["#d1d5db", "#fb923c", "#0000ff", "#ef4444"]; // Gray, Yellow, Orange, Red

  const [selectedAction, setSelectedAction] = useState("");

  const handleAutomate = () => {
    const studentcase = data.studentcases.find(studentcase => studentcase.studentid === selectedStudent.studentid);
    const category = data.casecategory.find(category => category.categoryid === studentcase.categoryid);
  
    if (category.categoryname === "Course Content") {
      setSelectedAction("flag-lecturer");
    } else if (category.categoryname === "Personal") {
      setSelectedAction("flag-uoncounsellor");
    } else if (category.categoryname === "Learning Issues") {
      setSelectedAction("flag-advisor");
    }
  };

  return (
    <div className="px-20 mx-auto mt-8">
      {/* Page Header */}
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-bold">Home - Dashboard</h1>
        <hr className="mt-4 mb-6" />
      </div>


    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Main Dashboard Container - Flagged Students */}
      <div className="w-full h-auto bg-[#D9D9D9] rounded-xl p-6 flex flex-wrap">
  <h3 className="text-xl font-bold mb-4 w-full">Flagged Overview</h3>

  {/*  Flagged Overview */}
  <div className="flex justify-center items-center w-full md:w-1/2"> 
    <ResponsiveContainer width="200%" height={250}> 
      <PieChart>
        <Pie
          activeIndex={activeIndex1}
          activeShape={renderActiveShape}
          data={[
            { name: 'Manually Flagged', value: data.studentgrades.filter((grade) => grade.flagstatus === 1).length },
            { name: 'Auto-Flagged', value: data.studentgrades.filter((grade) => grade.flagstatus === 2).length },
            { name: 'Responded', value: data.studentgrades.filter((grade) => grade.flagstatus === 3).length },
          ]}
          cx="50%" 
          cy="50%"
          innerRadius="50%" 
          outerRadius="80%"
          fill="#8884d8"
          paddingAngle={3}
          dataKey="value"
          onMouseEnter={onPieEnter1}
        >
          <Cell fill="#FFBB28" /> {/* Manually Flagged */}
          <Cell fill="#FF8042" /> {/* Auto-Flagged */}
          <Cell fill="#0088FE" /> {/* Responded */}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Flagged Students (Data Summary) */}
  <div className="flex flex-col w-full md:w-1/2 mt-4 md:mt-0 md:pl-4"> 
    <h3 className="text-lg font-semibold mb-2 text-gray-500">Flagged Students</h3>
    <ul>
      <li className="flex justify-between mb-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#FFBB28" }}></div>
          <span className="text-sm">Manually Flagged</span> 
        </div>
        <span className="text-sm ml-2">
          {data.studentgrades.filter((grade) => grade.flagstatus === 1).length}
        </span>
      </li>
      <li className="flex justify-between mb-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#FF8042" }}></div>
          <span className="text-sm">Auto-Flagged</span>
        </div>
        <span className="text-sm ml-2">
          {data.studentgrades.filter((grade) => grade.flagstatus === 2).length}
        </span>
      </li>
      <li className="flex justify-between mb-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#0088FE" }}></div>
          <span className="text-sm">Responded</span>
        </div>
        <span className="text-sm ml-2">
          {data.studentgrades.filter((grade) => grade.flagstatus === 3).length}
        </span>
      </li>
    </ul>
  </div>
</div>



<div className="w-full h-auto bg-[#D9D9D9] rounded-xl p-6 flex flex-wrap">
  <h3 className="text-xl font-bold mb-4 w-full">Case Overview</h3>

  
  <div className="flex justify-center items-center w-full md:w-1/2"> 
    <ResponsiveContainer width="200%" height={250}> 
      <PieChart>
        <Pie
          activeIndex={activeIndex2}
          activeShape={renderActiveShape}
          data={data.casecategory.map((category) => ({
            name: category.categoryname,
            value: data.studentcases.filter(
              (studentcase) => studentcase.categoryid === category.categoryid
            ).length,
          }))}
          cx="50%" 
          cy="50%"
          innerRadius="50%" 
          outerRadius="80%"
          fill="#8884d8"
          paddingAngle={3}
          dataKey="value"
          onMouseEnter={onPieEnter2}
        >
          {data.casecategory.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Phần Phải: Category Data */}
  <div className="flex flex-col w-full md:w-1/2 mt-4 md:mt-0 md:pl-4"> {/* Đặt w-full trên màn hình nhỏ, w-1/2 trên màn hình lớn */}
    <h3 className="text-lg font-semibold mb-2 text-gray-500">Category</h3>
    <ul>
      {data.casecategory.map((category, index) => (
        <li key={index} className="flex justify-between mb-2">
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-sm">{category.categoryname}</span> {/* Giảm kích thước font */}
          </div>
          <span className="text-sm ml-2">
            {data.studentcases.filter((studentcase) => studentcase.categoryid === category.categoryid).length}
          </span>
        </li>
      ))}
    </ul>
  </div>
</div>
      </div>


      {/* Buttons Above Pie Charts (Shown Only When a Card is Expanded) */}
      {expandedSection && (
  <div className="w-full mt-6">
    {/* Quick Navigation Header */}
    <div className="mb-6 text-center">
      <h2 className="text-xl font-semibold">Quick Navigation</h2>
    </div>

    {/* Navigation Buttons */}
    <div className="flex justify-center space-x-4">
      {["Course Content", "Learning Issues", "Personal"].map((buttonLabel, index) => (
        <button
          key={index}
          className={`py-2 px-4 rounded-md text-white ${
            expandedSection === buttonLabel
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={() => handleExpand(buttonLabel)}
          disabled={expandedSection === buttonLabel} // Disable the button for the current card
        >
          {buttonLabel}
        </button>
      ))}
    </div>
  </div>
)}
      

  
      {/* Cards Section */}
      <div>
<div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
  {sortedCards.map((card, index) => (
    <div
      key={index}
      className={`bg-[#D9D9D9] p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out ${
        expandedSection === card.title ? 'col-span-3 h-auto' : 'min-h-[316px]'
      }flex flex-col`}
      onClick={() => handleExpand(card.title)}
    >
      <h4 className="text-lg font-bold mb-4">{card.title}</h4>

      <div
        className={`${
          expandedSection === card.title ? 'flex flex-row gap-4' : 'flex flex-col items-center justify-center gap-2'
        }`}
      >
        {/* Donut Chart Section on the Left */}
<div className={`w-full md:w-1/3 mb-4 ${expandedSection === card.title ? 'mr-4' : ''}`}>
  <ResponsiveContainer width="100%" height={150}>
    <PieChart>
      <Pie
        data={[
          { name: card.title, value: data.studentcases.filter(studentcase => studentcase.categoryid === card.id).length },
          { name: "Remaining", value: data.studentcases.length - data.studentcases.filter(studentcase => studentcase.categoryid === card.id).length },
        ]}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={40}
        outerRadius={60}
        paddingAngle={3}
      >
        {/* Set slice colors based on card title */}
        <Cell 
          fill={
            card.title === "Course Content" ? "#00C49F" : // Green
            card.title === "Personal" ? "#FFBB28" : // Orange
            card.title === "Learning Issues" ? "#0088FE" : // Blue
            "#82ca9d" // Default color if none match
          } 
        />
        <Cell fill="#e0e0e0" />  {/* Color for the remaining (empty) portion */}
      </Pie>
    </PieChart>
  </ResponsiveContainer>

          {/* Total Students below Donut Chart */}
          <div className="text-lg font-semibold text-center mt-4">
            Total Students: {data.studentcases.filter(studentcase => studentcase.categoryid === card.id).length}
          </div>

          {/* Legend for Flag Status (only when expanded) */}
          {expandedSection === card.title && (
            <div className="text-center mt-2">
              <div className="flex justify-center space-x-4 text-sm items-center">
                <div className="flex items-center">
                  {/* Flagpole and flag icon for Moderate Risk */}
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <line x1="10" y1="5" x2="10" y2="60" stroke="black" strokeWidth="2" />
                    <polygon points="10,5 40,15 10,25" fill="blue" />
                  </svg>
                  <span>Auto flagged</span>
                </div>
                <div className="flex items-center">
                  {/* Flagpole and flag icon for Moderate Risk */}
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <line x1="10" y1="5" x2="10" y2="60" stroke="black" strokeWidth="2" />
                    <polygon points="10,5 40,15 10,25" fill="orange" />
                  </svg>
                  <span>Manually flagged</span>
                </div>
                <div className="flex items-center">
                  {/* Flagpole and flag icon for Low Risk */}
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <line x1="10" y1="5" x2="10" y2="60" stroke="black" strokeWidth="2" />
                    <polygon points="10,5 40,15 10,25" fill="#ef4444" />
                  </svg>
                  <span>Responded</span>
                </div>
                <div className="flex items-center">
                  {/* Flagpole and flag icon for Low Risk */}
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <line x1="10" y1="5" x2="10" y2="60" stroke="black" strokeWidth="2" />
                    <polygon points="10,5 40,15 10,25" fill="green" />
                  </svg>
                  <span>Acknowledged</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table on the Right */}
        {expandedSection === card.title && (
          <div className="w-full md:w-2/3 overflow-hidden transition-max-height duration-500 ease-in-out">
            <div className="p-4 text-gray-700">
              {/* Scrollable Table for students */}
              <div className="overflow-y-auto max-h-96 mt-4">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr className="bg-white-200">
                      <th className="border p-2">Student Name</th>
                      <th className="border p-2">Course No</th>
                      <th className="border p-2">Flag Status</th>
                      <th className="border p-2">Referral</th>
                      <th className="border p-2">Form Status</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.studentcases
                      .filter(studentcase => studentcase.categoryid === card.id)
                      .map((studentcase, studentIndex) => {
                        const student = data.students.find(student => student.studentid === studentcase.studentid);
                        const grade = data.studentgrades.find(
                          grade => grade.studentid === studentcase.studentid &&
                                   grade.courseid === studentcase.courseid);
                        return (
                          <tr key={studentIndex} className="text-center bg-white">
                            <td className="border p-2">
                              <div className="flex justify-center items-center h-full">
                                <span className="ml-2">{student? `${student.lastname} ${student.firstname}` : "N/A"}</span>
                              </div>
                            </td>
                            <td className="border p-2">{studentcase.courseid}</td>
                            <td className="border p-2">
                              <div className="flex justify-center items-center h-full">
                                <button onClick={() => openModal(student)} className="flex items-center justify-center">
                                  <svg
                                    className={`w-8 h-8`}
                                    viewBox="0 0 64 64"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    {/* Flagpole */}
                                    <line 
                                      x1="10" y1="5" 
                                      x2="10" y2="60" 
                                      stroke="black" 
                                      strokeWidth="2" 
                                    />
                                    {/* Flag */}
                                    <polygon 
                                      points="10,5 40,15 10,25" 
                                      fill={flagColors[grade.flagstatus]} 
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                            <td className="border p-2">{studentcase.referred ? studentcase.referred .split(" ") .map(word => { if (word.toLowerCase() === "uoncounsellor") { return "Uon Counsellor";} return word.charAt(0).toUpperCase() + word.slice(1); }) .join(" "): "N/A"} </td>
                            <td className="border p-2"> 
                            {studentcase.responded === 1 ? "✅" : "❌"} {/* Display 'Yes' or 'No' based on the responded value */}
                            </td>
                            <td className="border p-2">
                              <button onClick={() => handleModalOpen(studentcase, card.title)} className="text-lg font-bold">
                                ...
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ))}


</div>
</div>



  
{isModalOpen && selectedStudent && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-5xl relative flex">
      <button onClick={handleModalClose} className="absolute top-4 right-4">✕</button>

      <div className="flex w-full space-x-6">
        
        {/* Left Section */}
        <div className="w-1/2">
          <h2 className="text-xl font-bold text-center mb-4">Review Action</h2>

          <div className="mb-4">
          <div className="flex items-center justify-between">
    <p>
    <strong>Student Name:</strong>{" "}
      {selectedStudent
        ? `${selectedStudent.lastname || "N/A"} ${
            selectedStudent.firstname || "N/A"
          }`
        : "N/A"}
    </p>
    <button 
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 ml-auto"
      onClick={() => handleViewStudentCopy(selectedStudent.studentid, selectedStudent.formid)}
    >
      <span role="img" aria-label="document" className="mb-1">📄 Student Response</span> 
    </button>
  </div>
            <p><strong>Student ID:</strong> {selectedStudent.studentid || "N/A"}</p>
            <p><strong>Course:</strong> {
              (() => {
                const studentcase = data.studentcases.find(studentcase => studentcase.studentid === selectedStudent.studentid && studentcase.courseid === selectedStudent.courseid);
                return (studentcase.courseid);
              })()
            }</p>
            <p><strong>Trimester:</strong> {
              (() => {
                const studentcase = data.studentcases.find(studentcase => studentcase.studentid === selectedStudent.studentid);
                const grade = data.studentgrades.find(grade => grade.studentid === selectedStudent.studentid && grade.courseid === studentcase.courseid);
                return (grade.trimester);
              })()
            }</p>
            <p><strong>Case: </strong> {
              (() => {
                const studentcase = data.studentcases.find(studentcase => studentcase.studentid === selectedStudent.studentid);
                const category = data.casecategory.find(category => category.categoryid === studentcase.categoryid);
                return (category.categoryname);
              })()
            }</p>

            <p><strong>Grades: </strong></p>
            <div className="overflow-x-auto max-h-96 mt-4">
              <table className="table-auto w-full border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Journal 1</th>
                    <th className="border p-2">Journal 2</th>
                    <th className="border p-2">Assessment 1</th>
                    <th className="border p-2">Assessment 2</th>
                    <th className="border p-2">Assessment 3</th>
                    <th className="border p-2">Current Grade</th>
                    <th className="border p-2">Final Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const studentcase = data.studentcases.find(studentcase => studentcase.studentid === selectedStudent.studentid);
                    const grade = data.studentgrades.find(grade => grade.studentid === selectedStudent.studentid && grade.courseid === studentcase.courseid);
                    return (
                      <tr className="text-center">
                        <td className="border p-2">{grade.journal1}</td>
                        <td className="border p-2">{grade.journal2}</td>
                        <td className="border p-2">{grade.assessment1}</td>
                        <td className="border p-2">{grade.assessment2}</td>
                        <td className="border p-2">{grade.assessment3}</td>
                        <td className="border p-2">{grade.currentgrade}</td>
                        <td className="border p-2">{grade.finalgrade}</td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Select */}
          <label htmlFor="action" className="block font-semibold">Action:</label>
          <div className="flex items-center space-x-2 mb-4">
            <select
              id="action"
              className="w-full border p-2 rounded"
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
            >
              <option value="refer">Refer to</option>
              <option value="flag-lecturer">Lecturer</option>
              <option value="flag-uoncounsellor">UON Counsellor</option>
              <option value="flag-advisor">Advisor</option>
            </select>

            {/* Automate Button */}
            <button 
              onClick={handleAutomate} 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Automate
            </button>
          </div>

          {/* Save & Flag Button */}
          <div className="mt-6">
            <button onClick={saveReferredAction} className="w-full px-4 py-2 bg-blue-500 text-white rounded">Save & Update</button>
          </div>
        </div>

      {/* Right Section - Student History */}
<div className="w-1/2 border-l pl-6">
  <h2 className="text-xl font-bold text-center mb-4">Student History</h2>

  {/* Adjusted Scrollable Text Log */}
  <div className="mt-4 max-h-[30rem] overflow-y-auto bg-gray-100 p-6 rounded-lg shadow-inner">
    {Array.isArray(studentHistory) && studentHistory.length > 0 ? (
      studentHistory.map((entry, index) => (
        <div className="mb-4" key={index}>
          {/* Student Form Sent Date */}
          <p className="text-sm text-gray-500">
            <strong>Form Sent:</strong> {entry.created_at || 'N/A'}
          </p>

          {/* Student Form Submitted Date */}
          <p className="text-sm text-gray-500">
            <strong>Form Submitted:</strong> {entry.submitted_date || 'N/A'}
          </p>

          {/* Student Selected Issues (checkbox_options) */}
          <p className="text-sm text-gray-500">
            <strong>Student Selected Issues:</strong>{' '}
            {(() => {
              const options = entry.checkbox_options;
              if (Array.isArray(options) && options.length > 0) {
                return options.join(', ');
              } else if (typeof options === 'string' && options.trim()) {
                return options;
              }
              return 'N/A';
            })()}
          </p>

          {/* System Recommendation */}
          <p className="text-sm text-gray-500">
            <strong>System Recommendation:</strong> {entry.recommendation || 'N/A'}
          </p>

          {/* Early at Risk Form Selections */}
          <p className="text-sm text-gray-500">
            <strong>Early at Risk Form Issues:</strong>{' '}
            {entry.intervention_form_checkbox || 'N/A'}
          </p>

          {/* Early at Risk Form Comments */}
          <p className="text-sm text-gray-500">
            <strong>Early at Risk Form Comments:</strong>{' '}
            {entry.intervention_form_issues || 'N/A'}
          </p>

          <hr className="my-2 border-gray-300" />
        </div>
      ))
    ) : (
      <p className="text-gray-500">No history available for this student.</p>
    )}
  </div>
</div>

      </div>
    </div>
  </div>
)}

    </div>
  );
  
};

export default Dashboard;
