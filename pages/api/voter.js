import { connectToDatabase } from '@/utils/mongodb';
import Voter from '@/models/Voter';

export default async function handler(req, res) {
    if (req.method === 'POST') {

        const { phone, dob } = req.body;

        try {
            // Ensure you have a function to connect to your database
            await connectToDatabase();

            // Find and update the voter
            const voter = await Voter.findOne({ phone: phone, date_of_birth: dob });
            // Check if voter is found
            if (voter == null) {
                return res.status(404).json({ message: "No voter found with the provided phone number and date of birth." });
            }

            // Check if voter has already voted
            if (voter.voted == true) {
                return res.status(400).json({ message: "Vote already casted." });
            }

            // Return the voter data
            return res.status(200).json(voter);
        } catch (error) {
            console.error(`Error retrieving voter data: ${error.message}`);
            return res.status(500).json({ message: `Error retrieving voter data: ${error.message}` });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}