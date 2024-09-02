import React from 'react';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';  
import { useDataContext } from '../context/DataContext';

export default function DatePicker() {

  const { dateRange, setDateRange, maxDate, handleDateChange, dateSelector } = useDataContext();

  return (
    <Card className="datePicker item1">
      <Calendar value={dateRange} onChange={(e) => setDateRange(e.value as Date[])} showIcon dateFormat="dd/mm/yy" selectionMode="range" readOnlyInput hideOnRangeSelection variant="filled" maxDate={maxDate} />
      <Button raised rounded onClick={() => handleDateChange("7d")} className={`dateBtn ${dateSelector === "7d" ? "selected" : ""}`}>7d</Button>
      <Button raised rounded onClick={() => handleDateChange("14d")} className={`dateBtn ${dateSelector === "14d" ? "selected" : ""}`}>14d</Button>
      <Button raised rounded onClick={() => handleDateChange("30d")} className={`dateBtn ${dateSelector === "30d" ? "selected" : ""}`}>30d</Button>
    </Card>
  )

}