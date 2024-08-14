import { connectToDatabase } from '@/utils/mongodb'; // Adjust the import based on your project structure
import Election from '@/models/Election'; // Adjust the import based on your project structure

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await connectToDatabase(); // Ensure you have a function to connect to your database
            // Fetch the specific election document you want to update
            const election = await Election.findOne({}); // Adjust the query to match your criteria
            if (election) {
                election.status = req.body.status;
                await election.save();
                res.status(200).json(election.status);
            } else {
                res.status(404).json({ error: 'Election not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}