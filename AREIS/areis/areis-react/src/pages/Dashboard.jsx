import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, Sector, ResponsiveContainer } from 'recharts';

// Function to render the active sector with an expanded radius
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
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
      <text x={ex + (cos >= 0 ? 12 : -12)} y={ey} textAnchor={cos >= 0 ? 'start' : 'end'} fill="#333">{`Value: ${value}`}</text>
      <text x={ex + (cos >= 0 ? 12 : -12)} y={ey + 12} textAnchor={cos >= 0 ? 'start' : 'end'} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const Dashboard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState({ casecategory: [], studentcases: [], studentgrades: [] });
  const colors = ['#00C49F', '#0088FE', '#FFBB28'];
  const [expandedSection, setExpandedSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  

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
  const handleModalOpen = (student, cardTitle) => {
    setSelectedStudent(student);
    setIsModalOpen(true);

    //Ensure that the card stays expanded when the modal is opened
  setExpandedSection(cardTitle); 
  };

  // Function to handle closing the modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleViewStudentCopy = () => {
    const newWindow = window.open("", "_blank"); // Open a blank page first
    if (newWindow) {
      newWindow.document.write("<h1>Student Copy Page</h1>"); // Display temporary content if desired
    } else {
      console.error("Failed to open new tab/window, possibly blocked by the browser.");
    }
  };
  

  const flagColors = ["#d1d5db", "#fb923c", "#0000ff", "#ef4444"]; // Gray, Yellow, Orange, Red

  return (
    <div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Main Dashboard Container - Flagged Students */}
<div className="w-full h-[316px] bg-[#D9D9D9] rounded-xl p-6 flex">
  <h3 className="text-xl font-bold mb-4">Flagged Students</h3>

  {/* Left Section: Flagged Students (Piechart) */}
  <div className="flex justify-center items-center ml-24 w-1/2">
    <ResponsiveContainer width="120%" height={300}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={[
            { name: 'Manually Flagged', value: data.studentgrades.filter((grade) => grade.flagstatus === 1).length },
            { name: 'Auto-Flagged', value: data.studentgrades.filter((grade) => grade.flagstatus === 2).length },
            { name: 'Responded', value: data.studentgrades.filter((grade) => grade.flagstatus === 3).length },
          ]}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={3}
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          <Cell fill="#FFBB28" /> {/* Manually Flagged */}
          <Cell fill="#FF8042" /> {/* Auto-Flagged */}
          <Cell fill="#0088FE" /> {/* Responded */}
        </Pie>
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Left Section: Flagged Students (Data Summary) */}
  <div className="ml-24 flex flex-col justify-center w-1/2">
    <h3 className="text-xl font-bold mb-4 text-gray-500">Flagged Student Counts</h3>
    <ul>
      <li className="flex justify-between mb-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#FFBB28" }}></div>
          <span>Manually Flagged</span>
        </div>
        <span className="ml-24">
          {data.studentgrades.filter((grade) => grade.flagstatus === 1).length}
        </span>
      </li>
      <li className="flex justify-between mb-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#FF8042" }}></div>
          <span>Auto-Flagged</span>
        </div>
        <span className="ml-24">
          {data.studentgrades.filter((grade) => grade.flagstatus === 2).length}
        </span>
      </li>
      <li className="flex justify-between mb-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#0088FE" }}></div>
          <span>Responded</span>
        </div>
        <span className="ml-24">
          {data.studentgrades.filter((grade) => grade.flagstatus === 3).length}
        </span>
      </li>
    </ul>
  </div>
</div>


      {/* Second Dashboard Container */}
      <div className="w-full h-[316px] bg-[#D9D9D9] rounded-xl p-6 flex">
        <h3 className="text-xl font-bold mb-4">Overview</h3>
  
        {/* Right Section: Student cases (Piechart) */}
        <div className="flex justify-center items-center ml-24 w-1/2">
          <ResponsiveContainer width="120%" height={300}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data.casecategory.map((category) => ({
                  name: category.categoryname,
                  value: data.studentcases.filter(
                    (studentcase) => studentcase.categoryid === category.categoryid
                  ).length,
                }))}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {data.casecategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
  
        {/* Right Section: Student cases (data) */}
        <div className="ml-24 flex flex-col justify-center w-1/2">
          <h3 className="text-xl font-bold mb-4 text-gray-500">Value</h3>
          <ul>
            {data.casecategory.map((category, index) => (
              <li key={index} className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <span>{category.categoryname}</span>
                </div>
                <span className="ml-24">
                  {data.studentcases.filter((studentcase) => studentcase.categoryid === category.categoryid)
                    .length}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>
      

  
      {/* Cards Section */}
      <div>
<div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
  {sortedCards.map((card, index) => (
    <div
      key={index}
      className={`bg-[#D9D9D9] p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out ${
        expandedSection === card.title ? 'col-span-3 h-auto' : 'h-[316px]'
      }`}
      onClick={() => handleExpand(card.title)}
    >
      <h4 className="text-lg font-bold mb-4">{card.title}</h4>

      <div
        className={`${
          expandedSection === card.title ? 'flex flex-row' : 'flex flex-col items-center justify-center'
        }`}
      >
        {/* Donut Chart Section on the Left */}
        <div className={`w-full md:w-1/3 mb-4 ${expandedSection === card.title ? 'mr-4' : ''}`}>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={card.chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                fill={card.chartData[0].color}
              />
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
                  <span>Flagged referral</span>
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
                                <span className="ml-2">{student?.lastname} {student?.firstname}</span>
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
                            <td className="border p-2">Not in DB table</td>
                            <td className="border p-2">Not in DB table</td>
                            <td className="border p-2">
                              <button onClick={() => handleModalOpen(student)} className="text-lg font-bold">
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
          <div className="bg-white p-6 rounded-xl w-96 relative">
          <button onClick={handleModalClose} className="absolute top-4 right-4">✕</button>

            <button 
              className="absolute top-4 left-4 flex items-center bg-gray-100 p-2 rounded-lg shadow"
              onClick={handleViewStudentCopy}
            >
              <span role="img" aria-label="document" className="mr-2">📄</span> 
              View Student Copy
            </button>

            <h2 className="text-xl font-bold text-center mb-4">Review Action</h2>
  
            <div className="mb-4">
              <p><strong>Student Name:</strong> {selectedStudent.lastname} {selectedStudent.firstname}</p>
              <p><strong>Student ID:</strong> {selectedStudent.studentid}</p>
              <p><strong>Course:</strong> {
                  (() => {
                    const studentcase = data.studentcases.find(studentcase => studentcase.studentid === selectedStudent.studentid);
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
              <div className="overflow-y-auto max-h-96 mt-4">
                <table className="table-auto w-full border-collapse">
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
          <select id="action" className="w-full mb-4 border p-2 rounded">
            <option value="refer">Refer to</option>
            <option value="flag-lecturer">Lecturer</option>
            <option value="flag-counsellor">Counsellor</option>
            <option value="flag-coordinator">Course Coordinator</option>
          </select>
  
            {/* Advisor Select */}
          <label htmlFor="advisor" className="block font-semibold">Advisor:</label>
          <select id="advisor" className="w-full mb-4 border p-2 rounded">
            <option value="dr-kim">Dr Kim</option>
            <option value="dr-jones">Dr Jones</option>
            <option value="dr-Vincent">Dr Vincent</option>
          </select>

            <div className="flex justify-between">
              <button onClick={handleModalClose} className="px-4 py-2 bg-blue-500 text-white rounded">Save & Flag</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Dashboard;
