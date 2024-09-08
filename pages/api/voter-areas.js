import { connectToDatabase } from '@/utils/mongodb'; 
import Voter from '@/models/Voter'; 
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
      console.log("Get voters request received");

      const voters = await Voter.find({});
      const areas = [...new Set(voters.map(voter => voter.area))]; // Extract unique areas

      res.status(200).json(areas);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}