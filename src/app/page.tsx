"use client"

import "primereact/resources/themes/arya-purple/theme.css"
import { Card } from 'primereact/card'; 
import 'primeicons/primeicons.css';
import DatePicker from "@/components/DatePicker";
import DataCards from "@/components/DataCards";
import ActionMenu from "@/components/ActionMenu";
import RequestsErrorsChart from "@/components/RequestsErrorsChart";
import EndpointUsageTable from "@/components/EndpointUsageTable";
import { useDataContext } from '../context/DataContext';

export default function App() {

const { dailyChartData } = useDataContext();

  return (
<div className="container">
  <DatePicker/>
  <div className="dashboardTitle item2"><span className="titleSpan">boardapi</span> dashboard</div>

<ActionMenu/>

<DataCards/>

<div className="row3">
  <Card className="item7" id="chartTitle">
    {dailyChartData && (
      <RequestsErrorsChart />
    )}
  </Card>

  <EndpointUsageTable />
  </div>
</div>
  )
}