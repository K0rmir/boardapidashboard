"use client"

import "primereact/resources/themes/arya-purple/theme.css";
import { ApiDateAggregate, ChartData, ApiEndpointAggregate} from '@/lib/interfaces';
import { Card } from 'primereact/card';
import { useEffect, useState } from "react";
import { Calendar } from 'primereact/calendar';
import { DataTable, DataTableExpandedRows, DataTableRowEvent, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
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
import { Button } from 'primereact/button';  
import React from 'react';
import { SpeedDial } from 'primereact/speeddial';
import { MenuItem } from 'primereact/menuitem';  
// import { Tooltip } from 'primereact/tooltip'; 
import 'primeicons/primeicons.css';
import { CSVLink } from "react-csv";

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

// Preselected date function buttons //
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const sevenDaysAgo = (): Date[] => {
  const sevenDays = new Date();
  sevenDays.setDate(yesterday.getDate() - 6)
  return [sevenDays, yesterday];
}

const fourteenDaysAgo = (): Date[] => {
  const fourteenDays = new Date();
  fourteenDays.setDate(yesterday.getDate() - 13);
  return [fourteenDays, yesterday];
}

const thirtyDaysAgo = (): Date[] => {
  const thirtyDays = new Date();
  thirtyDays.setDate(yesterday.getDate() - 29);
  return [thirtyDays, yesterday];
}

// max date definition for calendar component //
const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - 1);

// Default to previous 7 days of data on page load //
const [dateRange, setDateRange] = useState<Date[]>(sevenDaysAgo);
// State variables for stat cards //
const [totalRequests, setTotalRequests] = useState<number>(0);
const [totalErrors, setTotalErrors] = useState<number>(0);
const [avgResTime, setAvgResTime] = useState<number>(0);
const [dailyChartData, setDailyChartData] = useState<ChartData>();
const [endpointDataTable, setEndpointDataTable] = useState<ApiEndpointAggregate[]>();
const [dateSelector, setDateSelector] = useState<string>("7d");
// State for CSV export //
const [dailyUsageExport, setDailyUseageExport] = useState<ApiDateAggregate | any>();
// const [dailyEndpointUsageExport, setDailyEndpointUseageExport] = useState<ApiEndpointAggregate>();
// State for expanded rows //
const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);

// Handle state changes from preselected date buttons //
function handleDateChange(preselectedDate: string) {
  switch(preselectedDate) {
    case "7d":
      setDateSelector("7d");
      setDateRange(sevenDaysAgo)
      break;
    case "14d":
      setDateSelector("14d");
      setDateRange(fourteenDaysAgo);
      break;
    case "30d":
      setDateSelector("30d");
      setDateRange(thirtyDaysAgo);
      break;
  }
};

const headers = [
  {label: 'Date', key: 'date'},
  {label: 'Request Count', key: 'totalRequestCount'},
  {label: 'Error Count', key: 'totalErrorCount'},
  {label: 'Response Time', key: 'totalResponseTime'},
];

const csvReport = {
  filename: 'boardapireport',
  headers: headers,
  data: dailyUsageExport,
};

// Action menu & CSV Export //
const items: MenuItem[] = [
  {
    template: (item: any) => {
      return (
        <>
        <CSVLink {...csvReport} >
          <span className="pi pi-download exportBtn" />
        </CSVLink>
        </>
      );
    },
  },
];

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
    const queryString = `startDate=${dateRange[0]}&endDate=${dateRange[1]}`;
    const response = await fetch(`/api/data?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // Call function to populate stat cards //
    countLogs(data[0]);

    // Generate data for chartjs bar chart //
    const dailyChartDataSets: ChartData = {
      labels: data[0].map((log: ApiDateAggregate) => new Date(log.date).toLocaleDateString()), // Generate array of labels for chart using dates.
      datasets: [
        {
          label: "Total Requests",
          borderRadius: 30,
          data: data[0].map((log: ApiDateAggregate) => log.totalRequestCount), // Generate array of requests per day 
          backgroundColor: "#CAC068",
          barThickness: 10,
        },
        {
          label: "Total Errors",
          borderRadius: 20,
          data: data[0].map((log: ApiDateAggregate) => log.totalErrorCount), // Generate array of errors per day
          backgroundColor: "#FF649D",
          barThickness: 10,
        },
      ],
    };

    setDailyChartData(dailyChartDataSets);
    setEndpointDataTable(data[1]);
    setDailyUseageExport(data[0]);

  } catch (error) {
      console.error(error);
    throw error;
  }
};

    // Count total requests, errors & res time for stat cards // 
    function countLogs(data: ApiDateAggregate[]) {

      let requestCount: number = 0;
      let errorCount: number = 0;
      let resTime: number = 0;
    
      for (const log of data) {
        requestCount = requestCount + log.totalRequestCount;
        errorCount = errorCount + log.totalErrorCount;
        resTime = resTime + log.totalResponseTime;
      }
      setTotalRequests(requestCount);
      setTotalErrors(errorCount);
      setAvgResTime(+(resTime / requestCount).toFixed(2)); // + here is 'unary plus operator' which attempts to convert its operand to a number if it isn't already //
      
    }

  // Options obj for chartjs bar chart //
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

  const rowExpansionTemplate = (data: ApiEndpointAggregate) => {
    const queryParamsArray = Object.entries(data.queryParams).map(([param, count]) => ({ param, count }));
    return (
      <div>
        <DataTable value={queryParamsArray}>
          <Column field="param" header="Query Param"/>
          <Column field="count" header="Response Count"/>
        </DataTable>
      </div>
    )
  }

  return (
<div className="container">
  <Card className="datePicker item1">
    <Calendar value={dateRange} onChange={(e) => setDateRange(e.value as Date[])} showIcon dateFormat="dd/mm/yy" selectionMode="range" readOnlyInput hideOnRangeSelection variant="filled" maxDate={maxDate} />
    <Button raised rounded onClick={() => handleDateChange("7d")} className={`dateBtn ${dateSelector === "7d" ? "selected" : ""}`}>7d</Button>
    <Button raised rounded onClick={() => handleDateChange("14d")} className={`dateBtn ${dateSelector === "14d" ? "selected" : ""}`}>14d</Button>
    <Button raised rounded onClick={() => handleDateChange("30d")} className={`dateBtn ${dateSelector === "30d" ? "selected" : ""}`}>30d</Button>
  </Card>
  <div className="dashboardTitle item2"><span className="titleSpan">boardapi</span> dashboard</div>

  <div className="item3" >
    {/* <Tooltip target=".speeddial-right .p-speeddial-action" position="left" /> */}
    <SpeedDial model={items} direction="left" style={{ top: 'calc(30% - 2rem)', position: 'relative',}} />
  </div>

  <div className="row2">
    <Card title="Total Requests" className="primaryStat item4">
      <p>{totalRequests}</p>
    </Card>
    <Card title="Total Errors" className="primaryStat item5">
      <p>{totalErrors}</p>
    </Card>
    <Card title="Avg Response Time" className="primaryStat item6">
      <p>{avgResTime}ms</p>
    </Card>
  </div>

  <div className="row3">
    <Card className="item7" id="chartTitle">
      <p>Total Requests & Errors By Day</p>
      {dailyChartData && (
        <Bar className="requestsErrorsChart" data={dailyChartData} options={options} />
      )}
    </Card>
    <Card className="item8" id="chartTitle">
      <p>Endpoint Usage</p>
      <DataTable value={endpointDataTable} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate} dataKey="endpoint" tableStyle={{ minWidth: '50rem' }} scrollable scrollHeight="500px">
        <Column expander={true} style={{ width: '3em' }} />
        <Column field="endpoint" header="Endpoint"></Column>
        <Column field="totalRequestCount" header="Total Requests"></Column>
        <Column field="totalErrorCount" header="Total Errors"></Column>
      </DataTable>
    </Card>
  </div>
</div>
  )
}