import { connectToDatabase } from '@/utils/mongodb'; // Adjust the import based on your project structure
import Voter from '@/models/Voter'; // Adjust the import based on your project structure
import Candidate from '@/models/Candidate'; // Adjust the import based on your project structure

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase(); 
      const voters = await Voter.find({present: true});
      const candidatesData = voters.map(voter => ({
        ...voter.toObject(), // Convert Mongoose document to plain object
        candidate_id: voter.voter_id, // Change voter_id to candidate_id
        votes: 0 // Set voters count to 0
      }));

      // Check for existing candidates
      const existingCandidates = await Candidate.find({
        candidate_id: { $in: candidatesData.map(candidate => candidate.candidate_id) }
      });

      const existingCandidateIds = new Set(existingCandidates.map(candidate => candidate.candidate_id));

      // Filter out existing candidates
      const newCandidatesData = candidatesData.filter(candidate => !existingCandidateIds.has(candidate.candidate_id));

      // Insert the modified data into the Candidate collection
      const candidates = await Candidate.insertMany(newCandidatesData);
      
      console.log(candidates);
      console.log(voters);
      res.status(200).json(candidates);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}