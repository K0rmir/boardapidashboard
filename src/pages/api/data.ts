import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from "@/lib/db";

export default async function data(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const { dateRange } = req.body;

    console.log("Date Range in DB Call is:", dateRange)

    try {
        const data = await db.query(`SELECT * FROM api_usage_aggregate WHERE date BETWEEN $1 AND $2`, [dateRange[0], dateRange[1]]);

        // Define the structure of the resulting array
        interface DateSummary {
            date: string;
            totalRequestCount: number;
            totalErrorCount: number;
        }

        // Define the structure of each entry in the db response
        interface jsonResponse {
            api_key: string;
            avg_response_time_ms: number;
            date: string | Date;
            endpoint: string;
            error_count: number;
            id: number;
            request_count: number;
        }

        // Initialize an object to keep track of each date's summary
        const dateSummaryMap: { [key: string]: DateSummary } = {};

        // Process each entry in the JSON response
        data.rows.forEach((entry: jsonResponse) => {
            const dateStr = typeof entry.date === 'string' ? entry.date : entry.date.toISOString();
            const date = dateStr.split('T')[0]; // Extract the date part from the datetime string

            if (!dateSummaryMap[date]) {
                dateSummaryMap[date] = {
                    date: date,
                    totalRequestCount: 0,
                    totalErrorCount: 0
                };
            }

            dateSummaryMap[date].totalRequestCount += entry.request_count;
            dateSummaryMap[date].totalErrorCount += entry.error_count;
        });

        // Convert the dateSummaryMap to an array
        const dateSummaries: DateSummary[] = Object.values(dateSummaryMap);

        res.status(200).json(dateSummaries);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' })
    }
}