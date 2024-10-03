import { Request, Response, NextFunction } from 'express';

// Fonction pour valider l'email avec une expression régulière simple
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Middleware pour vérifier l'email avant l'inscription
export const validateEmailMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // Vérifie si l'email est présent et valide
    if (!email || !isValidEmail(email)) {
        return res.status(400).json({
            message: 'Email non valide !'
        });
    }

    // Si l'email est valide, on passe au middleware suivant
    next();
};
