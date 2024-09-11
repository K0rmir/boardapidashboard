"use client"

import React, { createContext, useState, useContext, useEffect } from 'react';
import { ApiDateAggregate, ChartData, ApiEndpointAggregate, DataContextState, defaultDataContextState, DailyUsageExport} from '@/lib/interfaces';

const DataContext = createContext<DataContextState>(defaultDataContextState);

export default function DataProvider({ children }: { children: React.ReactNode }) {

// Preselected date function buttons //
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const sevenDaysAgo = (): Date[] => {
  const sevenDays = new Date();
  sevenDays.setDate(sevenDays.getDate() - 7)
  return [sevenDays, new Date(yesterday)];
}

const fourteenDaysAgo = (): Date[] => {
  const fourteenDays = new Date();
  fourteenDays.setDate(fourteenDays.getDate() - 14);
  return [fourteenDays, new Date(yesterday)];
}

const thirtyDaysAgo = (): Date[] => {
  const thirtyDays = new Date();
  thirtyDays.setDate(thirtyDays.getDate() - 30);
  return [thirtyDays, new Date(yesterday)];
}

// max date definition for calendar component //
const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - 1);

// Formate Date //
const formatDate = (date: Date): string => {
const year = date.getFullYear().toString();
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const day = date.getDate().toString().padStart(2, '0');
return `${year}-${month}-${day}`;
}

// Date States - Default to previous 7 days of data on page load //
const [dateRange, setDateRange] = useState<Date[]>(sevenDaysAgo());
const [dateSelector, setDateSelector] = useState<string>("7d");
const [dailyChartData, setDailyChartData] = useState<ChartData>();
const [endpointTableData, setEndpointTableData] = useState<ApiEndpointAggregate[]>();
const [totalRequests, setTotalRequests] = useState<number>(0);
const [totalErrors, setTotalErrors] = useState<number>(0);
const [avgResTime, setAvgResTime] = useState<number>(0);
const [dailyUsageExport, setDailyUseageExport] = useState<ApiDateAggregate | any>(); // needs to be worked on to get rid of type any
const [dailyEndpointExport, setDailyEndpointExport] = useState<ApiEndpointAggregate | any>(); // <-- no longer needed

useEffect(() => {
    if (dateRange[0] && dateRange[1]) { // Ensure two dates are selected //
      const formattedDateRange = dateRange.map(date => formatDate(date));
      getData(formattedDateRange)
    }
  }, [dateRange])

// Handle state changes from preselected date buttons in DatePicker component //
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

    console.log("This is data [0]", data[0]);
    console.log("This is data [1]", data[1]);

    // Call function to populate stat cards //
    countLogs(data[0]);

    // Generate data for chartjs bar chart //
    const dailyChartDataSets: ChartData = {
      labels: data[0].map((log: ApiDateAggregate) => new Date(log.date).toLocaleDateString()), // Generate array of labels for chart using dates.
      datasets: [
        {
          label: "Total Requests",
          borderRadius: 30,
          data: data[0].map((log: ApiDateAggregate) => log.dailyTotalRequestCount), // Generate array of requests per day 
          backgroundColor: "#CAC068",
          barThickness: 10,
        },
        {
          label: "Total Errors",
          borderRadius: 20,
          data: data[0].map((log: ApiDateAggregate) => log.dailyTotalErrorCount), // Generate array of errors per day
          backgroundColor: "#FF649D",
          barThickness: 10,
        },
      ],
    };

    setDailyChartData(dailyChartDataSets);
    setEndpointTableData(data[1]);
    setDailyUseageExport(data[0]);
    // setDailyEndpointExport(data[1]);

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
      requestCount = requestCount + log.dailyTotalRequestCount;
      errorCount = errorCount + log.dailyTotalErrorCount;
      resTime = resTime + log.dailyTotalResponseTime;
    }
    setTotalRequests(requestCount);
    setTotalErrors(errorCount);
    setAvgResTime(+(resTime / requestCount).toFixed(2)); // + here is 'unary plus operator' which attempts to convert its operand to a number if it isn't already //
  }

    return (
        <DataContext.Provider value={{
          dateRange,
          setDateRange,
          maxDate,
          handleDateChange,
          dateSelector,
          totalRequests,
          totalErrors,
          avgResTime,
          dailyUsageExport,
          dailyEndpointExport,
          dailyChartData,
          endpointTableData,
        }}>
            {children}
        </DataContext.Provider>
    )
}

export function useDataContext() {
    return useContext(DataContext);
};

