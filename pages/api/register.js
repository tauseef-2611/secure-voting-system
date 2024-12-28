import { connectToDatabase } from '@/utils/mongodb';
import Voter from '@/models/Voter';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name,phone,dob, unit,area } = req.body;

        try {
            // Ensure you have a function to connect to your database
            await connectToDatabase();

            const voters = await Voter.find({}, { voter_id: 1 }).exec();
            const voterIds = voters.map(voter => parseInt(voter.voter_id, 10));
            const largestVoterId = Math.max(...voterIds);
            console.log(largestVoterId)
            let newVoterId;
        
            if (largestVoterId!=0) {
              // Convert voter_id to a number, increment it, and convert back to a string
              // const latestVoterIdNumber = parseInt(latestVoter.voter_id, 10);
              newVoterId = (largestVoterId + 1).toString();

              console.log("Assigning new id:", newVoterId )
            } else {
              newVoterId = '1'; // Start from '1' if no voters exist
            }
            // Create a new voter with the incremented voter_id
            const newVoter = new Voter({
              voter_id: newVoterId,
              name: name,
              phone: phone,
              date_of_birth: dob,
              unit: unit,
              area: area,
              voted: false,
              present: true,
              verified: false
            });
        
            await newVoter.save();
            console.log("Voter added successfully");
            return res.status(200).json(newVoter);
        }
        catch (error) {
            console.error(`Error adding voter: ${error.message}`);
            return res.status(500).json({ message: `Error adding voter: ${error.message}` });
        }
    }
    else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}


