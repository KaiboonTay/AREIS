import { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Sector, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Course Content', value: 12, color: '#00C49F' },
  { name: 'Learning Issues', value: 22, color: '#0088FE' },
  { name: 'Personal', value: 12, color: '#FFBB28' },
];

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

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
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
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
            {data.map((entry, index) => (
              <li key={index} className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span>{entry.name}</span>
                </div>
                <span className="ml-24">{entry.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
