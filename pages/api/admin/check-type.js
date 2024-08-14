import { connectToDatabase } from '@/utils/mongodb'; // Adjust the import based on your project structure
import Election from '@/models/Election'; // Adjust the import based on your project structure

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectToDatabase(); // Ensure you have a function to connect to your database
      // Fetch all documents from the Voters collection
        const election= await Election.find({});
        res.status(200).json(election.type);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}