import { connectToDatabase } from '@/utils/mongodb'; // Adjust the import based on your project structure
import Candidate from '@/models/Candidate'; // Adjust the import based on your project structure

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {

      await connectToDatabase(); // Ensure you have a function to connect to your database
      console.log("Get Candidates request received");

      const candidates = await Candidate.find({});
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