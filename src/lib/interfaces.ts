import { Dispatch, SetStateAction } from "react";

// Define structure of each entry in the db response //
interface ApiLogAggregate {
  api_key: string;
  total_response_time_ms: number;
  date: string | Date;
  endpoint: string;
  error_count: number;
  id: number;
  request_count: number;
  query_params: string[]
}

interface QueryParamCount {
  [key: string]: number
}

// Define the structure of dates when collated //
interface ApiDateAggregate {
  date: string;
  totalRequestCount: number;
  totalErrorCount: number;
  totalResponseTime: number;
}

// Define the structure of dates when collated //
interface ApiEndpointAggregate {
  endpoint: string;
  totalRequestCount: number;
  totalErrorCount: number;
  queryParams: QueryParamCount;
}

// Define the structure of data for chartjs bar chart //
interface ChartData {
  labels: string[],
  datasets: {
    label: string,
    borderRadius: number,
    data: number[],
    backgroundColor: string,
    barThickness: number
  }[];
}

interface DataContextState {
  dateRange: Date[];
  setDateRange: Dispatch<SetStateAction<Date[]>>;
  maxDate: Date;
  handleDateChange: (preselectedDate: string) => void;
  dateSelector: string;
  totalRequests: number;
  totalErrors: number;
  avgResTime: number;
  dailyUsageExport: [];
  dailyChartData: ChartData | undefined;
  endpointTableData: ApiEndpointAggregate[] | undefined;
}

export const defaultDataContextState: DataContextState = {
  dateRange: [],
  setDateRange: () => { },
  maxDate: new Date(),
  handleDateChange: () => [],
  dateSelector: "",
  totalRequests: 0,
  totalErrors: 0,
  avgResTime: 0,
  dailyUsageExport: [],
  dailyChartData: {
    labels: [],
    datasets: [{
      label: " ",
      borderRadius: 0,
      data: [],
      backgroundColor: "",
      barThickness: 0
    }],
  },
  endpointTableData: [{
    endpoint: "",
    totalRequestCount: 0,
    totalErrorCount: 0,
    queryParams: {}
  }],
}

export type {
  ApiLogAggregate,
  ApiDateAggregate,
  ApiEndpointAggregate,
  ChartData,
  DataContextState,
}