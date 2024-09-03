import React from 'react';
import { SpeedDial } from 'primereact/speeddial';
import { MenuItem } from 'primereact/menuitem'; 
import { Tooltip } from 'primereact/tooltip'; 
import { CSVLink } from "react-csv"; 
import { useDataContext } from '../context/DataContext';

export default function ActionMenu() {

const { dailyUsageExport } = useDataContext();

    // Action menu //
const items: MenuItem[] = [
    {
      label: 'Export',
      // template: (item: any) => {
      //   return (
      //     <>
      //     <Tooltip target=".exportBtn" content="Export to CSV" position="left" appendTo={() => document.body}  />
      //     <CSVLink {...csvReport} >
      //       <span className="pi pi-download exportBtn"/>
      //     </CSVLink>
      //     </>
      //   );
      // },
    },
  ];

// CSV Export // 
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

  return (
    <>
      <div className="item3" >
        <SpeedDial model={items} direction="left" style={{ top: 'calc(30% - 2rem)', position: 'relative',}} />
      </div>
    </>
  );
};