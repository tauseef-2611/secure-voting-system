import { connectToDatabase } from '@/utils/mongodb'; // Adjust the path as necessary
import Election from '@/models/Election'; // Adjust the path as necessary
import Voter from '@/models/Voter'; // Adjust the path as necessary
import Candidate from '@/models/Candidate'; // Adjust the path as necessary

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      // Delete all the collections of voters and candidates
      await Voter.deleteMany({});
      await Candidate.deleteMany({});
      await Election.deleteMany({});
      res.status(200).json({ message: 'Election and related data deleted successfully' });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
};

export default handler;