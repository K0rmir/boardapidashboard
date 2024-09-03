"use client"

import "primereact/resources/themes/arya-purple/theme.css"
import { ApiDateAggregate, ApiEndpointAggregate} from '@/lib/interfaces';
import { useState } from "react";
import { DataTable, DataTableExpandedRows, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card'; 
import 'primeicons/primeicons.css';
import DatePicker from "@/components/DatePicker";
import DataCards from "@/components/DataCards";
import ActionMenu from "@/components/ActionMenu";
import RequestsErrorsChart from "@/components/RequestsErrorsChart";
import { useDataContext } from '../context/DataContext';

export default function App() {

const { dailyChartData } = useDataContext();

// State variables for stat cards //
const [endpointDataTable, setEndpointDataTable] = useState<ApiEndpointAggregate[]>();
// State for CSV export //
const [dailyUsageExport, setDailyUseageExport] = useState<ApiDateAggregate | any>();
// State for expanded rows //
const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);

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

<ActionMenu/>

<DataCards/>

  <div className="row3">
    <Card className="item7" id="chartTitle">
      <p>Total Requests & Errors By Day</p>
      {dailyChartData && (
        <RequestsErrorsChart />
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