import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const { intervals } = req.body;
    
    if (!Array.isArray(intervals) || intervals.length === 0) {
        return res.status(400).json({ message: 'Intervals are required.' });
    }
    
    try {
        // Aqui você pode salvar os intervalos no banco de dados
        // Exemplo fictício:
        // await prisma.timeInterval.createMany({ data: intervals });
    
        return res.status(201).json({ message: 'Time intervals saved successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error saving time intervals.' });
    }
}