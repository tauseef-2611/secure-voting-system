import { connectToDatabase } from '@/utils/mongodb'; 
import Candidate from '@/models/Candidate'; 
import {validateSession} from '@/app/actions';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const session=await validateSession(req.headers.cookie?.split('; ').find(cookie => cookie.startsWith('session='))?.split('=')[1])
      if(!session)
      {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      await connectToDatabase(); 
      console.log("Get Candidates request received");

      const { area } = req.query; // Extract the area parameter from the query string
      const candidates = await Candidate.find(area ? { area } : {}); // Query based on area if provided
    
      res.status(200).json(candidates);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}