import { connectToDatabase } from '@/utils/mongodb'; // Adjust the import based on your project structure
import Voter from '@/models/Voter'; // Adjust the import based on your project structure

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {

      await connectToDatabase(); // Ensure you have a function to connect to your database
      console.log("Get voters request received");

      const voters = await Voter.find({});
      //retirn the number of voters

      const analytics = {
        total: voters.length,
        voted: voters.filter(voter => voter.voted).length,
        notVoted: voters.filter(voter => !voter.voted).length,
        present: voters.filter(voter => voter.present).length,
        areaWisePresent: voters.reduce((acc, voter) => {
          if (!acc[voter.area]) {
            acc[voter.area] = 0;
          }
          if (voter.present) {
            acc[voter.area]++;
          }
          return acc;
        }, {}),
        areaWiseVoted: voters.reduce((acc, voter) => {
          if (!acc[voter.area]) {
            acc[voter.area] = 0;
          }
          if (voter.voted) {
            acc[voter.area]++;
          }
          return acc;
        }, {})
      };
            // console.log(voters);
      res.status(200).json(analytics);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}