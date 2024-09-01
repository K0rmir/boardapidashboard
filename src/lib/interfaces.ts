import { Dispatch, SetStateAction } from "react";
import { Data } from "react-csv/lib/core";

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
}

export const defaultDataContextState: DataContextState = {
    dateRange: [],
    setDateRange: () => { },
    maxDate: new Date(),
    handleDateChange: () => [],
    dateSelector: ""
}

export type {
    ApiLogAggregate,
    ApiDateAggregate,
    ApiEndpointAggregate,
    ChartData,
    DataContextState,
}