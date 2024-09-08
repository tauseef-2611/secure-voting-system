import {connectToDatabase} from '@/utils/mongodb';
import Election from '@/models/Election';
import {validateSession} from '@/app/actions';

const handler = async (req, res) => {
    if (req.method === 'GET') {
      try {
        const session=await validateSession(req.headers.cookie?.split('; ').find(cookie => cookie.startsWith('session='))?.split('=')[1])
        if(!session)
        {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        await connectToDatabase();
        const election= await Election.find({});
        if (election.length === 0) {
          res.status(304).json({ error: 'No election found' });
          return;
        }
        res.status(200).json(election);
        }
        catch (err) {
            console.error('Error fetching elections:', err);
            res.status(500).send({ error: 'Internal Server Error', details: err.message });
        }
    }
    else {
        res.status(405).send({ error: 'Method Not Allowed' });
    }
}


export default (req, res) => {
      handler(req, res);
  };
