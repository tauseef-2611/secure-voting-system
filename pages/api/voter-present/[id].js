import { connectToDatabase } from '@/utils/mongodb';
import Voter from '@/models/Voter';
import {validateSession} from '@/app/actions';


export default async function handler(req, res) {

    if (req.method === 'GET') {

        const session=await validateSession(req.headers.cookie?.split('; ').find(cookie => cookie.startsWith('session='))?.split('=')[1])
        if(!session)
        {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.query;

        if (!id) {
            console.log("ID is missing in the request");
            return res.status(400).json({ message: 'ID is required' });
        }

        try {
            await connectToDatabase();

            const voter = await Voter.findOne({ voter_id: id });
            if (!voter) {
                console.log("Voter not found with id:", id);
                return res.status(404).json({ message: 'Voter not found' });
            }

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