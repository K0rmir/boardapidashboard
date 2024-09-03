import React from 'react';
import { useDataContext } from '../context/DataContext';
import { Card } from 'primereact/card'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          size: 18,
          color: 'white'
        },
    },
    },
  },
};

export default function RequestsErrorsChart() {

  const { dailyChartData } = useDataContext();

    return (
      <>
        <Card className="item7" id="chartTitle">
        <p>Total Requests & Errors By Day</p>
        {dailyChartData && (
        <Bar className="requestsErrorsChart" data={dailyChartData} options={options} />
      )}
        </Card>
      </>
  )
}