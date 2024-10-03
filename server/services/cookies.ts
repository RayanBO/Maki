import { Response } from "express";
import { jwtCreate } from "@server/services/jwt"; // Ajustez le chemin en fonction de votre projet

export const setCookiesUser = async (user: any, res: Response) => {
    // Créez le token JWT pour l'utilisateur
    const compteToken = { user: user };
    const token = await jwtCreate(compteToken);

    // Définissez le cookie avec le token
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Active `secure` en production
        maxAge: 24 * 60 * 60 * 1000, // 1 jour en millisecondes
    });

    return token;
};
