import { connectToDatabase } from '@/utils/mongodb'; 
import Candidate from '@/models/Candidate'; 
import Voter from '../../models/Voter';

export default async function handler(req, res) {
  if (req.method === 'POST') {
        try {
      const { candidateVotes } = req.body; 
      const voterId = req.params.voterId;
            console.log('Request body:', req.body);
    
      if (!Array.isArray(candidateVotes)) {
        console.error('Invalid input format: candidateVotes is not an array');
        return res.status(400).send({ error: 'Invalid input format' });
      }
    
      if (candidateVotes.length === 0) {
        console.error('Invalid input format: candidateVotes array is empty');
        return res.status(400).send({ error: 'Invalid input format' });
      }
    
      console.log('Received candidateVotes:', candidateVotes);
    
      await connectToDatabase();
    
      const bulkOps = candidateVotes.map(candidateId => ({
        updateOne: {
          filter: { _id: candidateId },
          update: { $inc: { votes: 1 } }, // Increment votes by 1
        },
      }));
      console.log('Bulk operations:', bulkOps);
    
      const result = await Candidate.bulkWrite(bulkOps);
      console.log('Votes updated successfully:', result);
      voter=Voter.findOneAndUpdate({voter_id:voterId},{$set:{vote_Casted:true}});
    
      res.status(200).send({ message: 'Votes updated successfully' });
    } catch (err) {
      console.error('Error updating votes:', err); // Add detailed logging here
      res.status(500).send({ error: 'Internal Server Error', details: err.message });
    }
}
}