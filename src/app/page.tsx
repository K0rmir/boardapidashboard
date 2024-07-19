"use client"

import "primereact/resources/themes/arya-purple/theme.css";
import { ApiDateAggregate, ChartData} from '@/lib/interfaces';
import { Card } from 'primereact/card';
import { useEffect, useState } from "react";
import { Calendar } from 'primereact/calendar';
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

// Format date //
const formatDate = (date: Date): string => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function App() {

  // Get dates to be used in db call //
const getInitialDateRange = (): Date[] => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(yesterday.getDate() - 6);

  return [sevenDaysAgo, yesterday];
}

// Default to previous 7 days of data on page load //
const [dateRange, setDateRange] = useState<Date[]>(getInitialDateRange());

// State variables for stat cards //
const [totalRequests, setTotalRequests] = useState<number>(0);
const [totalErrors, setTotalErrors] = useState<number>(0);
const [avgResTime, setAvgResTime] = useState<number>(0);

const [chartData, setChartData] = useState<ChartData>();

// Anytime date is updated, call api to call db //
useEffect(() => {
  if (dateRange[0] && dateRange[1]) { // Ensure two dates are selected //
    const formattedDateRange = dateRange.map(date => formatDate(date as Date));
    getData(formattedDateRange)
  }
}, [dateRange])

// DB call with date range as parameter //
async function getData(dateRange: string[]) {
  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dateRange })
    });

    const data = await response.json();
    console.log("Data front end =", data);

    // Call function to populate stat cards //
    countLogs(data);

    // Generate data for chartjs bar chart //
    const chartDataSets: ChartData = {
      labels: data.map((log: ApiDateAggregate) => log.date), // Generate array of labels for chart using dates.
      datasets: [
        {
          label: "Total Requests",
          borderRadius: 30,
          data: data.map((log: ApiDateAggregate) => log.totalRequestCount), // Generate array of requests per day 
          backgroundColor: "rgba(32, 214, 155, 1)",
          barThickness: 10,
        },
        {
          label: "Total Errors",
          borderRadius: 20,
          data: data.map((log: ApiDateAggregate) => log.totalErrorCount), // Generate array of errors per day
          backgroundColor: "rgba(1, 98, 255, 1)",
          barThickness: 10,
        },
      ],
    };

    setChartData(chartDataSets);

  } catch (error) {
      console.error(error);
    throw error;
  }
};

    // Count total requests, errors & res time for stat cards // 
    function countLogs(data: ApiDateAggregate[]) {
      let requestCount: number = 0;
      let errorCount: number = 0;
    
      for (const log of data) {
        requestCount = requestCount + log.totalRequestCount;
        errorCount = errorCount + log.totalErrorCount;
      }
      setTotalRequests(requestCount);
      setTotalErrors(errorCount);
    }

  // Options obj for chartjs bar chart //
   const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Total Requests & Errors',
      },
    },
  };

  return (
    <div>
      <Card className="primaryStatContainer">
        <Card title="Total Requests" className="primaryStat">
          <p>{totalRequests}</p>
        </Card>
        <Card title="Total Errors" className="primaryStat">
          <p>{totalErrors}</p>
        </Card>
        <Card title="Avg Response Time" className="primaryStat">
          <p>0</p>
        </Card>
        <Card className="primaryStat">
          <Calendar value={dateRange} onChange={(e) => setDateRange(e.value as Date[])} showIcon dateFormat="dd/mm/yy" selectionMode="range" readOnlyInput hideOnRangeSelection/>
        </Card>
      </Card>
      <div className="requestsErrorsChartContainer">
        {chartData && ( // Ensure chartData exists before rendering chart //
          <Bar className="requestsErrorsChart" data={chartData} options={options} />
          )}
      </div>

    </div>
  )
}