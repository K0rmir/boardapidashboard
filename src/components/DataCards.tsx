import React from 'react';
import { useDataContext } from '../context/DataContext';
import { Card } from 'primereact/card'; 

export default function DataCards() {
    const { totalRequests, totalErrors, avgResTime } = useDataContext();

  return (
    <>
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
    </>
    )
}