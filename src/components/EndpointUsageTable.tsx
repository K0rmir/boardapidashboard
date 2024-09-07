import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card'; 
import { DataTable, DataTableExpandedRows, DataTableValueArray } from 'primereact/datatable';
import { ApiEndpointAggregate} from '../lib/interfaces';

export default function EndpointUsageTable() {

  const { endpointTableData } = useDataContext();
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
      <>
        <Card className="item8" id="chartTitle">
          <p>Endpoint Usage</p>
          <DataTable value={endpointTableData} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate} dataKey="endpoint" tableStyle={{ minWidth: '50rem' }} scrollable scrollHeight="500px">
            <Column expander={true} style={{ width: '3em' }} />
            <Column field="endpoint" header="Endpoint"></Column>
            <Column field="totalRequestCount" header="Total Requests"></Column>
            <Column field="totalErrorCount" header="Total Errors"></Column>
          </DataTable>
        </Card>
      </>
    )
}