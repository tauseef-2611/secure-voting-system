import mongoose from 'mongoose';

const ElectionSchema = new mongoose.Schema({
    area: { type: String, required: true },
    date: { type: Date, required: true },
    type: { 
        type: String, 
        required: true, 
        enum: ["Presidential", "Advisory Council", "Electoral Collage"] 
    },
    status: { 
        type: String, 
        required: true, 
        enum: ["ready", "ongoing", "completed"]
    },
    presiding_officer: { type: String, required: true },
    perAreaNominees: { type: Number, required: function() { return this.type === "Electoral Collage"; } },
    council_size: { type: Number, required: function() { return this.type === "Advisory Council"; } }
});

export default mongoose.models.Election || mongoose.model('Election', ElectionSchema);