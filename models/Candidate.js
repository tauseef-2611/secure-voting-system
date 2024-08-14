import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
    candidate_id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    year_of_membership: { type: Number, required: true },
    date_of_birth: { type: String, required: true },
    unit: { type: String, required: true },
    area: { type: String, required: true },
    votes: { type: Number, required: true },
});

export default mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);