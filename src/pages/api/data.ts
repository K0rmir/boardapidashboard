import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from "@/lib/db";
import { ApiDateAggregate, ApiLogAggregate, ApiEndpointAggregate } from '@/lib/interfaces';

export default async function data(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const { dateRange } = req.body;

    console.log("Date Range in DB Call is:", dateRange)

    try {
        const data = await db.query(`SELECT * FROM api_usage_aggregate WHERE date BETWEEN $1 AND $2`, [dateRange[0], dateRange[1]]);

        // Initialize empty object to keep track of each dates summary //
        const dateSummary: { [key: string]: ApiDateAggregate } = {};

        // Process each date in the db response //
        data.rows.forEach((log: ApiLogAggregate) => {

            const dateStr = typeof log.date === 'string' ? log.date : log.date.toISOString();
            const date = dateStr.split('T')[0]; // Extract the date from the datetime string //

            if (!dateSummary[date]) {
                dateSummary[date] = {
                    date: date,
                    totalRequestCount: 0,
                    totalErrorCount: 0
                };
            }
            dateSummary[date].totalRequestCount += log.request_count;
            dateSummary[date].totalErrorCount += log.error_count;
        });

        // Initialize empty object to keep track of each endpoint summary // 
        const endpointSummary: { [key: string]: ApiEndpointAggregate } = {};

        // Process each endpoint in the db response //
        data.rows.forEach((log: ApiLogAggregate) => {
            const endpoint: string = log.endpoint;

            if (!endpointSummary[endpoint]) {
                endpointSummary[endpoint] = {
                    endpoint: endpoint,
                    totalRequestCount: 0,
                    totalErrorCount: 0
                };
            }
            endpointSummary[endpoint].totalRequestCount += log.request_count;
            endpointSummary[endpoint].totalErrorCount += log.error_count;
        });

        // Convert dateSummary & endpointSummary objects to an array
        const dateSummaries: ApiDateAggregate[] = Object.values(dateSummary);
        const endpointSummaries: ApiEndpointAggregate[] = Object.values(endpointSummary);

        // Return both arrays in an array for front end visualisation //
        const apiLogSummaries = [dateSummaries, endpointSummaries];

        res.status(200).json(apiLogSummaries);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' })
    }
}