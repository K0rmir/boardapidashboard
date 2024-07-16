"use client"

import "primereact/resources/themes/arya-purple/theme.css";
import { Card } from 'primereact/card';
import { useEffect, useState } from "react";

export default function App() {

const getYesterdayDate = (): string => {
  // Create a new Date object and set it to yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Format the date as YYYY-MM-DD
  const year = yesterday.getFullYear();
  const month = (yesterday.getMonth() + 1).toString().padStart(2, '0');
  const day = yesterday.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const [date, setDate] = useState<string>(getYesterdayDate);

useEffect(() => {
  getData(date);
}, [date])

// Call DB with whatever the date is as parameter //
async function getData(date: string) {
  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date })
    });

    const data = await response.json();

    console.log("Data =", data);

  } catch (error) {
    console.error(error);
    throw error;
  }
};

  return (
    <div>
      <Card className="primaryStatContainer">
        <Card title="Total Requests" className="primaryStat">
          <p>0</p>
        </Card>
        <Card title="Total Errors" className="primaryStat">
          <p>0</p>
        </Card>
        <Card title="Avg Response Time" className="primaryStat">
          <p>0</p>
        </Card>
        <Card title="Date" className="primaryStat">
          <p>0</p>
        </Card>
      </Card>

    </div>
  )
}