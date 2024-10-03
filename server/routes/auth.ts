import express from "express";
import controller from "@server/controllers/auth";
import {
    mustBeAdminAccount,
    mustBeLoggedIn,
    mustBeNotAdminAccount,
    shouldBeLoggedOut,
} from "@server/middlewares/auth";
import { validateEmailMiddleware } from "@server/middlewares/register";

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: API pour la gestion de l'authentification des utilisateurs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *               firstname:
 *                 type: string
 *                 description: Le prénom de l'utilisateur
 *               lastname:
 *                 type: string
 *                 description: Le nom de l'utilisateur
 *     responses:
 *       201:
 *         description: Utilisateur enregistré avec succès
 *       400:
 *         description: Entrée invalide
 */
const router = express.Router();
router.post("/register", validateEmailMiddleware, controller.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Non autorisé
 */
router.post("/login", mustBeNotAdminAccount, shouldBeLoggedOut, controller.login);

/**
 * @swagger
 * /api/auth/login/admin:
 *   post:
 *     summary: Connexion d'un administrateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'administrateur
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'administrateur
 *     responses:
 *       200:
 *         description: Connexion administrateur réussie
 *       401:
 *         description: Non autorisé
 */
router.post("/login/admin", shouldBeLoggedOut, mustBeAdminAccount, controller.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur actuel
 *     tags: [Authentification]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post("/logout", controller.logout);

/**
 * @swagger
 * /api/auth/who:
 *   get:
 *     summary: Obtenir les informations de l'utilisateur actuellement connecté
 *     tags: [Authentification]
 *     responses:
 *       200:
 *         description: Renvoie les informations de l'utilisateur actuel
 *       401:
 *         description: Non autorisé
 */
router.get("/who", mustBeLoggedIn, controller.who);

export default router;
