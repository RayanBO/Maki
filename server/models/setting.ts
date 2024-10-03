import mongoose from 'mongoose';

const { Schema } = mongoose;

const declarationSurLhonneur = new Schema({
    declaration: {
        type: String,
        required: false,
    },
    signature: {
        type: String,
        required: false,
    },
});

const priceSchema = new Schema({
    label: { type: String, required: true }, // e.g., 'Taxi'
    is_prix_personnalise: { type: Boolean, default: false }, // Whether the price is customized
    montant_personalise: { type: Number, default: 0 }, // Custom price
    montant_moyen_constate: { type: Number, required: true }, // Average observed price
});

const settingSchema = new Schema({
    version: { type: String, required: true },
    appName: { type: String, required: true },
    list_voiture_type: { type: [String], default: ['SUV', 'Taxi', 'Taxi Moto', 'Bajaja'] },
    list_payment_type: { type: [String], default: ['Espèce', 'Mvola', 'Orange Money', 'Airtel Money'] },
    description: { type: String },
    logo_url: { type: String },
    logo_text_url: { type: String },
    commission_percentage: { type: Number, required: true, default: 12 },
    declarationSurLhonneur: {
        type: declarationSurLhonneur,
        required: false
    },
    bonus_parainage_client: { type: Number, required: true, default: 500 },
    bonus_parainage_driver: { type: Number, required: true, default: 500 },
    prix_recommande: { type: [priceSchema], required: false }, // List of recommended prices
});

// Check if the model already exists before defining it
const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);

export default Setting;