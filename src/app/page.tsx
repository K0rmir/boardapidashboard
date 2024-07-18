"use client"

import "primereact/resources/themes/arya-purple/theme.css";
import { Card } from 'primereact/card';
import { useEffect, useState } from "react";
import { Calendar } from 'primereact/calendar';

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

  return [yesterday, yesterday];
}

  // Set date as state, default to yesterday by calling getDateRange function //
  const [dateRange, setDateRange] = useState<Date[]>(getInitialDateRange());

// Main state variables for stat cards //
// vvv Set states here to be yesterdays from dates obj instead of 0
const [totalRequests, setTotalRequests] = useState<number>(0);
const [totalErrors, setTotalErrors] = useState<number>(0);
const [avgResTime, setAvgResTime] = useState<number>(0);

// Anytime date is updated, call api to call db //
useEffect(() => {
  if (dateRange[0] && dateRange[1]) {
    const formattedDateRange = dateRange.map(date => formatDate(date as Date));
    getData(formattedDateRange)
  }
}, [dateRange])

// DB call with whatever the date is as parameter //
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

    // Call count logs function to populate dashboard with data //
    countLogs(data);

  } catch (error) {
      console.error(error);
    throw error;
  }
};

    // Function to count total requests, errors & res time // 
    function countLogs(data: any) {
      let requestCount: number = 0;
      let errorCount: number = 0;
    
      for (const log of data) {
        requestCount = requestCount + log.totalRequestCount;
        errorCount = errorCount + log.totalErrorCount;
      }
      setTotalRequests(requestCount);
      setTotalErrors(errorCount);
    }

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

    </div>
  )
}