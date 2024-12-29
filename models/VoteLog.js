import mongoose from 'mongoose';

const VoteLogSchema = new mongoose.Schema({
  voter_id: { type: String, required: true },
  candidateVotes: { type: [String], required: true },
  timestamp: { type: Date, default: Date.now },
});

const VoteLog = mongoose.models.VoteLog || mongoose.model('VoteLog', VoteLogSchema);

export default VoteLog;