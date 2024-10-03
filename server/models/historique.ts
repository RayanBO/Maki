import mongoose, { Schema } from 'mongoose';

const HistoriqueSchema: Schema = new Schema({
    type: { type: String, required: true },
    subtype: { type: String, required: true },
    histo_date: { type: Date, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: false,
    },
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
        required: false,
    },
    details: {
        type: Map,
        require: false
    }
});

export default mongoose.model('Historique', HistoriqueSchema);
