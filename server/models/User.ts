import mongoose, { Schema, UpdateQuery } from 'mongoose';


const habilitationSchema = new mongoose.Schema({
    module: {
        type: String,
        required: false,
    },
    access: {
        type: Number,
        required: false,
        default: 0
    },
});



// Définissez le schéma pour le modèle "User"
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // L'email doit être unique
    },
    password: {
        type: String,
        required: true,
    },
    is_admin: {
        type: Boolean,
        default: false, // Par défaut, l'utilisateur n'est pas un administrateur
    },
    created_at: {
        type: Date,
        default: Date.now, // Date de création par défaut
    },
    is_driver: {
        type: Boolean,
        default: false, // Par défaut, l'utilisateur est client
    },
    confirmed: {
        type: Boolean,
        default: false, // Par défaut, l'utilisateur n'est pas confirmé
    },
    confirmationCode: {
        type: String,
        default: "", // Default empty string if not provided
    },
    confirmCodeExpireAt: {
        type: Date,
        default: null, // Use null as default if not provided
    },
    confirmDate: {
        type: Date,
        default: null, // Default to null if not provided
    },
    tel_number: {
        type: String,
        default: "", // Default empty string if not provided
    },
    tel_confirmed: {
        type: Boolean,
        default: false, // Par défaut, l'utilisateur n'est pas confirmé
    },
    tel_confirmationCode: {
        type: String,
        default: "", // Default empty string if not provided
    },
    tel_confirmCodeExpireAt: {
        type: Date,
        default: null, // Default to null if not provided
    },
    tel_confirmDate: {
        type: Date,
        default: null, // Default to null if not provided
    },
    firstname: {
        type: String,
        default: "", // Default empty string if not provided
    },
    lastname: {
        type: String,
        required: true,
    },
    birthdate: {
        type: Date,
        default: null, // Default to null if not provided
    },
    picture: {
        type: String,
        default: "", // Default empty string if not provided
    },
    course_number: {
        type: Number,
        default: 0, // Default to 0 if not provided
    },
    course_distance: {
        type: Number,
        default: 0, // Default to 0 if not provided
    },
    appareils: {
        type: [String],
        default: [], // Default empty array if not provided
    },
    infos_client: {
        credits: { type: Number, default: 0 }, // Default to 0 if not provided
        bio: { type: String, default: "" }, // Default empty string if not provided
    },
    admin_habilitation: {
        is_super_admin: { type: Boolean, default: true, required: false }, // Default to 0 if not provided
        list_habilitation: { type: [habilitationSchema], default: [], required: false }, // Default empty string if not provided
    },
    infos_driver: {
        tarif_par_km: { type: Number, default: 0 }, // Default to 0 if not provided
        is_verified: { type: Boolean, default: false }, // Default to false if not provided
        presentation: {
            type: Map,
            of: String,
            default: {}, // Default empty map if not provided
        },
        payment_method: {
            type: [String],
            default: [], // Default empty array if not provided
        },
        rating_global: {
            driver_star: { type: Number, default: 0 },
            caution_rating: { type: Number, default: 0 },
            sympathy_rating: { type: Number, default: 0 },
            punctuality_rating: { type: Number, default: 0 },
            rating_starts: { type: Number, default: 0 },
            rating_count: { type: Number, default: 0 },
        },
    },
    language: {
        type: Map,
        default: {}, // Default empty map if not provided
    },
    // parrain: { type: Schema.Types.ObjectId, required: false, ref: 'User' },
    parrain: { type: String, required: false },
    filleuls: {
        type: [
            {
                user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                date: { type: Date, default: Date.now }, // Default current date if not provided
                gain_gagne: { type: Number, default: 0 }, // Default to 0 if not provided
                gain_blocked: { type: Boolean, default: true }, // Default to true if not provided
                gain_claimed: { type: Boolean, default: false }, // Default to false if not provided
                argent_gagne: { type: Number, default: 0 }, // Default to 0 if not provided
                argent_blocked: { type: Boolean, default: true }, // Default to true if not provided
                argent_claimed: { type: Boolean, default: false }, // Default to false if not provided
            }
        ],
        default: [], // Default empty array if not provided
    },
});



// Créez le modèle "User" à partir du schéma
const User = mongoose.model("User", userSchema, "users");

export default User;
