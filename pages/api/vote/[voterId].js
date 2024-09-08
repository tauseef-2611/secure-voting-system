import { connectToDatabase } from '@/utils/mongodb'; 
import Candidate from '@/models/Candidate'; 
import Voter from '@/models/Voter';
import {validateSession} from '@/app/actions';

export default async function handler(req, res) {
  const { voterId } = req.query;

  const session=await validateSession(req.headers.cookie?.split('; ').find(cookie => cookie.startsWith('session='))?.split('=')[1])
  if(!session)
  {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!voterId) {
    return res.status(400).json({ error: 'Voter ID is required' });
  }

  if (req.method === 'POST') {
        try {
      const { candidateVotes } = req.body; 
    
      if (!Array.isArray(candidateVotes)) {
        console.error('Invalid input format: candidateVotes is not an array');
        return res.status(400).send({ error: 'Invalid input format' });
      }
    
      if (candidateVotes.length === 0) {
        console.error('Invalid input format: candidateVotes array is empty');
        return res.status(400).send({ error: 'Invalid input format' });
      }
    
    
      await connectToDatabase();
    
      const bulkOps = candidateVotes.map(candidateId => ({
        updateOne: {
          filter: { _id: candidateId },
          update: { $inc: { votes: 1 } }, // Increment votes by 1
        },
      }));
    
      const result = await Candidate.bulkWrite(bulkOps);
      await Voter.findOneAndUpdate(
        { voter_id: voterId },
        { $set: { voted: true } },
        { new: true } // This option returns the updated document
      );
      res.status(200).send({ message: 'Votes updated successfully' });
    } catch (err) {
      console.error('Error updating votes:', err); // Add detailed logging here
      res.status(500).send({ error: 'Internal Server Error', details: err.message });
    }
}
}