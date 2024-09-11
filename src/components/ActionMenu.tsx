import React from 'react';
import { SpeedDial } from 'primereact/speeddial';
import { MenuItem } from 'primereact/menuitem'; 
import { Tooltip } from 'primereact/tooltip'; 
import { CSVLink } from "react-csv"; 
import { useDataContext } from '../context/DataContext';
import { ApiDateAggregate, ApiEndpointAggregate } from '@/lib/interfaces';

export default function ActionMenu() {

const { dailyUsageExport = [], endpointTableData = [] } = useDataContext() as unknown as {
  dailyUsageExport: ApiDateAggregate[];
  endpointTableData: ApiEndpointAggregate[];
};

// CSV Headers // 
const headers = [
  {label: 'Date', key: 'date'},
  {label: 'Request Count', key: 'dailyTotalRequestCount'},
  {label: 'Error Count', key: 'dailyTotalErrorCount'},
  {label: 'Response Time', key: 'dailyTotalResponseTime'},
];

// Sort data for CSV export. Despite daily usage and endpoint data already being two separate arrays, 
// data has to flattened like this due to how the data prop in react-csv works. 
function setCsvData() {
  const dailyUsageData = dailyUsageExport.map((item) => ({
    date: item.date || 'N/A',
    dailyTotalRequestCount: item.dailyTotalRequestCount || 0,
    dailyTotalErrorCount: item.dailyTotalErrorCount || 0,
    dailyTotalResponseTime: item.dailyTotalResponseTime || 0,
  }));

  // Simulate second row of headers by placing endpoint data below existing ones.
  // This method feels hacky and keys to values are misleading however it works.
  const endpointHeaders = {
    date: 'Endpoint', 
    dailyTotalRequestCount: 'Total Request Count',
    dailyTotalErrorCount: 'Total Error Count',
    dailyTotalResponseTime: 'Query Params',
  };

  const endpointData = endpointTableData.map((item => ({
    date: item.endpoint || 'N/A',
    dailyTotalRequestCount: item.endpointTotalRequestCount || 0,
    dailyTotalErrorCount: item.endpointTotalErrorCount || 0,
    dailyTotalResponseTime: item.queryParams || 'N/A',
  })));

  const combinedData = [...dailyUsageData, {}, endpointHeaders, ...endpointData];

  return combinedData;  
}

// Action menu //
const items: MenuItem[] = [
    {
      label: 'Export',
      template: (item: any) => {
        return (
          <>
          <Tooltip target=".exportBtn" content="Export to CSV" position="left" appendTo={() => document.body}  />
          <CSVLink data={setCsvData()} headers={headers} filename='boardapireport.csv'>
            <span className="pi pi-download exportBtn"/>
          </CSVLink>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="item3" >
        <SpeedDial model={items} direction="left" style={{ top: 'calc(30% - 2rem)', position: 'relative',}} />
      </div>
    </>
  );
};