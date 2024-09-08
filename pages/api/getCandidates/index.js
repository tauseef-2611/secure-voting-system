import { connectToDatabase } from '@/utils/mongodb'; // Adjust the import based on your project structure
import Candidate from '@/models/Candidate'; // Adjust the import based on your project structure
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

      const candidates = await Candidate.find({}, { votes: 0 });
            // console.log(candidates);
      res.status(200).json(candidates);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}