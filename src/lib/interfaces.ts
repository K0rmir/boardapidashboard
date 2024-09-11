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
  dailyTotalRequestCount: number;
  dailyTotalErrorCount: number;
  dailyTotalResponseTime: number;
}

// Define the structure of dates when collated //
interface ApiEndpointAggregate {
  endpoint: string;
  endpointTotalRequestCount: number;
  endpointTotalErrorCount: number;
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

interface DailyUsageExport {
  dailyUsage: {
    date: string;
    totalRequestCount: number;
    totalErrorCount: number;
    totalResponseTime: number;
  }
  endpoints: {
    endpoint: string;
    totalRequestCount: number;
    totalErrorCount: number;
    queryParams: QueryParamCount;
  }
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
  dailyUsageExport: ApiDateAggregate;
  dailyEndpointExport: ApiEndpointAggregate;
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
  dailyUsageExport: {
    date: "",
    dailyTotalRequestCount: 0,
    dailyTotalErrorCount: 0,
    dailyTotalResponseTime: 0
  },
  dailyEndpointExport: {
    endpoint: "",
    endpointTotalRequestCount: 0,
    endpointTotalErrorCount: 0,
    queryParams: {
      "": 0,
    }
  },
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
    endpointTotalRequestCount: 0,
    endpointTotalErrorCount: 0,
    queryParams: {}
  }],
}

export type {
  ApiLogAggregate,
  ApiDateAggregate,
  ApiEndpointAggregate,
  ChartData,
  DataContextState,
  DailyUsageExport
}



// dailyUsageExport: {
//   dailyUsage: {
//     date: "",
//     totalRequestCount: 0,
//     totalErrorCount: 0,
//     totalResponseTime: 0
//   },
//   endpoints: {
//     endpoint: "",
//     totalRequestCount: 0,
//     totalErrorCount: 0,
//     queryParams: {
//       "": 0
//     }
//   }
// },