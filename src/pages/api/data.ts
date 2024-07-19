import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from "@/lib/db";
import { ApiDateAggregate, ApiLogAggregate } from '@/lib/interfaces';

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

        // Process each entry in the db response //
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

        // Convert dateSummary objects to an array
        const dateSummaries: ApiDateAggregate[] = Object.values(dateSummary);

        res.status(200).json(dateSummaries);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' })
    }
}