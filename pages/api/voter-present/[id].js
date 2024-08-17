import { connectToDatabase } from '@/utils/mongodb';
import Voter from '@/models/Voter';

export default async function handler(req, res) {
    console.log("Voter Present login info");

    if (req.method === 'GET') {
        const { id } = req.query;
        console.log("Received GET request with id:", id);

        if (!id) {
            console.log("ID is missing in the request");
            return res.status(400).json({ message: 'ID is required' });
        }

        try {
            await connectToDatabase();
            console.log("Connected to database");

            const voter = await Voter.findOne({ voter_id: id });
            if (!voter) {
                console.log("Voter not found with id:", id);
                return res.status(404).json({ message: 'Voter not found' });
            }
            console.log("Voter is present:", voter.present);

            return res.status(200).json({ present: voter.present });
        } catch (error) {
            console.error('Error checking voter:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        console.log("Invalid request method:", req.method);
        return res.status(405).json({ message: 'Method not allowed' });
    }
}