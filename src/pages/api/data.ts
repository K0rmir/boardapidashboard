import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from "@/lib/db";

export default async function data(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const { date } = req.body;

    try {
        const data = await db.query(`SELECT * FROM api_usage_aggregate WHERE date = $1`, [date]);
        res.status(200).json(data.rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' })
    }
}