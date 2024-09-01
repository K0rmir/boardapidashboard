"use client"

import "primereact/resources/themes/arya-purple/theme.css";
import { ApiDateAggregate, ChartData, ApiEndpointAggregate} from '@/lib/interfaces';
import { Card } from 'primereact/card'; 
import { useState } from "react";
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
// import React from 'react';
import { SpeedDial } from 'primereact/speeddial';
import { MenuItem } from 'primereact/menuitem';  
// import { Tooltip } from 'primereact/tooltip'; 
import 'primeicons/primeicons.css';
import { CSVLink } from "react-csv";
import DatePicker from "@/components/DatePicker"
import DataCards from "@/components/DataCards"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function App() {

// State variables for stat cards //
const [dailyChartData, setDailyChartData] = useState<ChartData>();
const [endpointDataTable, setEndpointDataTable] = useState<ApiEndpointAggregate[]>();
// State for CSV export //
const [dailyUsageExport, setDailyUseageExport] = useState<ApiDateAggregate | any>();
// State for expanded rows //
const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);

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
    // template: (item: any) => {
    //   return (
    //     <>
    //     <CSVLink {...csvReport} >
    //       <span className="pi pi-download exportBtn" />
    //     </CSVLink>
    //     </>
    //   );
    // },
  },
];

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
  <DatePicker/>
  <div className="dashboardTitle item2"><span className="titleSpan">boardapi</span> dashboard</div>

  <div className="item3" >
    {/* <Tooltip target=".speeddial-right .p-speeddial-action" position="left" /> */}
    <SpeedDial model={items} direction="left" style={{ top: 'calc(30% - 2rem)', position: 'relative',}} />
  </div>

  <DataCards/>

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