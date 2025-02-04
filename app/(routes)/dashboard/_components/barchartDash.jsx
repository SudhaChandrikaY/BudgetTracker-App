import React from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function BarchartDash({ budgetList }) {
  // Add a calculated field for progress in the budgetList array
  const processedData = budgetList.map((budget) => ({
    ...budget,
    remaining: budget.amount - budget.totalSpend,  // Calculate remaining budget
  }));

  return (
    <div className='border rounded-lg p-5'>
      <h2 className='font-bold text-lg'>Activity</h2>
      <ResponsiveContainer width="80%" height={300}>
        <BarChart
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Show totalSpend and remaining as stacked sections in a single bar */}
          <Bar dataKey='totalSpend' fill='#283841' stackId='a' name='Spent' />
          <Bar dataKey='remaining' fill='#d1d5db' stackId='a' name='Remaining' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarchartDash;
