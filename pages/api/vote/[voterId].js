import { connectToDatabase } from '@/utils/mongodb';
import Candidate from '@/models/Candidate';
import Voter from '@/models/Voter';
import VoteLog from '@/models/VoteLog';
import rateLimit from '@/utils/rateLimiter';
import { validateSession } from '@/app/actions'; // Ensure this is correctly imported

// Custom rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 200 requests per windowMs
});

export default async function handler(req, res) {
  try {
    // Apply rate limiter
    await limiter(req, res);

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { voterId } = req.query;
    const { candidateVotes } = req.body;

    console.log('voterId:', voterId);
    console.log('candidateVotes:', candidateVotes);

    // Validate input
    if (!voterId || !Array.isArray(candidateVotes) || candidateVotes.length === 0) {
      return res.status(400).json({ error: 'Invalid input format' });
    }

    const sessionToken = req.headers.cookie
      ?.split('; ')
      .find(cookie => cookie.startsWith('session='))
      ?.split('=')[1];

    const session = await validateSession(sessionToken);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await connectToDatabase();

    // Check if the voter has already voted
    const voter = await Voter.findOne({ voter_id: voterId }, { voted: 1 });
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }
    if (voter.voted) {
      return res.status(400).json({ error: 'Voter has already voted' });
    }

    // Attempt to update all candidates atomically
    const updateResults = await Promise.all(
      candidateVotes.map(async candidateId => {
        try {
          const result = await Candidate.updateOne(
            { _id: candidateId },
            { $inc: { votes: 1 } }
          );
          return result;
        } catch (error) {
          console.error(`Error updating candidate ${candidateId}:`, error);
          return null;
        }
      })
    );

    // Ensure all updates were successful
    const allUpdatesSuccessful = updateResults.every(
      result => result && result.matchedCount > 0
    );

    if (!allUpdatesSuccessful) {
      console.error('One or more candidate updates failed');
      return res.status(500).json({ error: 'Failed to record all votes' });
    }

    // Mark the voter as having voted
    const voterUpdateResult = await Voter.updateOne(
      { voter_id: voterId },
      { $set: { voted: true } }
    );

    if (!voterUpdateResult.matchedCount || !voterUpdateResult.modifiedCount) {
      console.error('Failed to update voter status');
      return res.status(500).json({ error: 'Failed to update voter status' });
    }

    // Log the vote asynchronously (non-blocking)
    logVote(voterId, candidateVotes);

    res.status(200).json({ message: 'Votes recorded successfully' });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Background logging to reduce latency
async function logVote(voterId, candidateVotes) {
  try {
    const voteLog = new VoteLog({ voter_id: voterId, candidateVotes });
    await voteLog.save();
  } catch (error) {
    console.error('Error logging vote:', error);
  }
}
