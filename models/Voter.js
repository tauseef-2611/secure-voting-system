import mongoose from 'mongoose';

const VoterSchema = new mongoose.Schema({
    voter_id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    year_of_membership: { type: Number, required: true },
    date_of_birth: { type: String, required: true },
    unit: { type: String, required: true },
    area: { type: String, required: true },
    verified: { type: Boolean, required: true },
    present: { type: Boolean, required: true },
    voted: { type: Boolean, required: true }
});

export default mongoose.models.Voter || mongoose.model('Voter', VoterSchema);