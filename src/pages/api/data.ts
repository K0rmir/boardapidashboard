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
        res.status(200).json(data.rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' })
    }
}