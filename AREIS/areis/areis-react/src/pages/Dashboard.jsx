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

  const cardsData = [
    { title: 'Course Content', chartData: [{ name: 'Completed', value: 32, color: '#FF5A5A' }] },
    { title: 'Learning Issues', chartData: [{ name: 'Completed', value: 22, color: '#3498db' }] },
    { title: 'Personal', chartData: [{ name: 'Completed', value: 15, color: '#f39c12' }] }
  ];

  useEffect(() => {
    fetch('/dashboard/')
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleExpand = (section) => {
    setExpandedSection((prevSection) => (prevSection === section ? null : section));
  };

  return (
    <div className="p-6">
      {/* Main Dashboard Container */}
      <div className="w-full h-[316px] bg-[#D9D9D9] rounded-xl p-6 flex">
        <h3 className="text-xl font-bold mb-4">Overview</h3>

        {/* Left Section: Donut Chart with ResponsiveContainer */}
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

        {/* Right Section: Data Summary */}
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

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className={`bg-[#D9D9D9] p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out ${
              expandedSection === card.title ? 'col-span-3 h-auto' : 'h-[316px]'
            }`}
            onClick={() => handleExpand(card.title)}
          >
            <h4 className="text-lg font-bold mb-4">{card.title}</h4>
            <div
              className={`flex ${
                expandedSection === card.title ? 'flex-col' : 'flex-col items-center justify-center'
              }`}
            >
              {/* Donut Chart Section */}
              <div className="flex justify-center items-center w-full md:w-1/3 mb-4">
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
              </div>

              {/* Number of students */}
              <div className={`text-lg font-semibold ${expandedSection === card.title ? 'text-center mt-4' : ''}`}>
                {card.chartData[0].value} students
              </div>

              {/* Table Section (Visible only when expanded) */}
              {expandedSection === card.title && (
                <div className="flex-grow bg-gray-200 p-4 rounded-lg mt-4 w-full">
                  <h5 className="font-bold mb-2">{card.title} Details</h5>
                  <table className="w-full text-left table-auto">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Course No</th>
                        <th>Lecturer</th>
                        <th>Status</th>
                        <th>Automated Ref.</th>
                        <th>Form Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Alpha</td>
                        <td>1234</td>
                        <td>Dr Vincent</td>
                        <td>🚩</td>
                        <td>Dr Kim</td>
                        <td>❌</td>
                        <td>•••</td>
                      </tr>
                      <tr>
                        <td>Beta</td>
                        <td>1234</td>
                        <td>Dr Vincent</td>
                        <td>🚩</td>
                        <td>Dr Kim</td>
                        <td>✔️</td>
                        <td>•••</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
