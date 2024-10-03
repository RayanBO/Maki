import { v4 as uuidv4 } from "uuid";

/**
 * Export constants from here
 */

export const SERVER_PORT = process.env.SERVER_PORT || "3000";
export const MONGODB_URI = process.env.MONGODB_URI || "";
export const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD || MONGODB_URI;
export const SESSION_SECRET = process.env.SESSION_SECRET || "";
export const TOKEN_SECRET = process.env.TOKEN_SECRET || uuidv4();
export const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || "1h";
export const HASH_SALT_ROUNDS = 10;
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "null";

// VANILLA PAY 
export const CLE_PRIVE  = process.env.CLE_PRIVE || "";
export const CLE_PUBLIC  = process.env.CLE_PUBLIC || "";
export const CLIENT_ID  = process.env.CLIENT_ID || "";
export const CLIENT_SECRET  = process.env.CLIENT_SECRET || "";
// vanilla PAY ---> BANK 
export const CLIENT_ID_BANK  = process.env.CLIENT_ID_BANK || "";
export const CLIENT_SECRET_BANK  = process.env.CLIENT_SECRET_BANK || "";
export const KEY_SECRET  = process.env.KEY_SECRET || "";
export const VIP_VERSION  = process.env.VIP_VERSION || "";

export const SITE_URL  = process.env.SITE_URL || "";
export const MY_IP  = process.env.MY_IP || "";

export const BREVO_API_KEY  = process.env.BREVO_API_KEY || "";

export const IS_PROD = !!process.env.IS_PROD;

export const RESET = "\x1b[0m";
export const BRIGHT = "\x1b[1m";
export const FG_GREEN = "\x1b[32m";
export const FG_YELLOW = "\x1b[33m";
export const FG_BLUE = "\x1b[34m";
export const FG_MAGENTA = "\x1b[35m";
export const FG_CYAN = "\x1b[36m";

// Durée de validité du code (5 minutes en millisecondes)
export const CODE_VALIDITY_DURATION = 5 * 60 * 1000;


// export const PROD_URL_HTTP="http://3.12.146.12:3000"
export const PROD_URL_HTTP="https://api.soavadi.com"
