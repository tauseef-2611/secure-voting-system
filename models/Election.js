import mongoose from 'mongoose';

const ElectionSchema = new mongoose.Schema({
    area: { type: String, required: true },
    date: { type: Date, required: true },
    type: { 
        type: String, 
        required: true, 
        enum: ["Presidential", "Advisory Council", "Electoral College"] 
    },
    status: { 
        type: String, 
        required: true, 
        enum: ["ready", "ongoing", "completed"]
    },
    presiding_officer: { type: String, required: true },
    ecRatio: { type: String },
    council_size: { type: Number, required: function() { return this.type === "Advisory Council"; } },
    nominee_size: { 
        type: Number, 
        required: function() { return this.type === "Presidential"; } 
    },
    perAreaNominees: { 
        type: Map, 
        of: Number, 
    },
    takeAttendance: { type: Boolean, required: true },
});

export default mongoose.models.Election || mongoose.model('Election', ElectionSchema);