import { connectToDatabase } from '@/utils/mongodb'; 
import Candidate from '@/models/Candidate'; 
import Voter from '@/models/Voter';
import VoteLog from '@/models/VoteLog';
import { validateSession } from '@/app/actions';
import rateLimit from '@/utils/rateLimiter';
import mongoose from 'mongoose';

// // Custom rate limiter
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });

export default async function handler(req, res) {
  try {
    // await limiter.check(res, 100, req.headers['x-forwarded-for'] || req.connection.remoteAddress);

    const { voterId } = req.query;

    const sessionToken = req.headers.cookie?.split('; ').find(cookie => cookie.startsWith('session='))?.split('=')[1];
    const session = await validateSession(sessionToken);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!voterId) {
      return res.status(400).json({ error: 'Voter ID is required' });
    }

    if (req.method === 'POST') {
      try {
        const { candidateVotes } = req.body;

        if (!Array.isArray(candidateVotes)) {
          console.error('Invalid input format: candidateVotes is not an array');
          return res.status(400).send({ error: 'Invalid input format' });
        }

        if (candidateVotes.length === 0) {
          console.error('Invalid input format: candidateVotes array is empty');
          return res.status(400).send({ error: 'Invalid input format' });
        }

        await connectToDatabase();

        const mongoSession = await mongoose.startSession();
        mongoSession.startTransaction();

        try {
          // Check if voter has already voted
          const voter = await Voter.findOne({ voter_id: voterId }).session(mongoSession);
          if (voter.voted) {
            await mongoSession.abortTransaction();
            mongoSession.endSession();
            return res.status(400).send({ error: 'Voter has already voted' });
          }

          const bulkOps = candidateVotes.map(candidateId => ({
            updateOne: {
              filter: { _id: candidateId },
              update: { $inc: { votes: 1 } }, // Increment votes by 1
              session: mongoSession // Ensure session is included
            },
          }));

          const result = await Candidate.bulkWrite(bulkOps, { session: mongoSession });
          await Voter.findOneAndUpdate(
            { voter_id: voterId },
            { $set: { voted: true } },
            { new: true, session: mongoSession } // This option returns the updated document
          );

          // Log the vote
          const voteLog = new VoteLog({
            voter_id: voterId,
            candidateVotes: candidateVotes,
          });
          
          await voteLog.save({ session: mongoSession });

          await mongoSession.commitTransaction();
          mongoSession.endSession();

          res.status(200).send({ message: 'Votes updated successfully' });
        } catch (err) {
          await mongoSession.abortTransaction();
          mongoSession.endSession();
          throw err;
        }
      } catch (err) {
        console.error('Error updating votes:', err); // Add detailed logging here
        res.status(500).send({ error: 'Internal Server Error', details: err.message });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch {
    res.status(429).send('Too Many Requests');
  }
}