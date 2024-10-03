import express from "express";
import controller from "@server/controllers/auth";
import {
    mustBeAdminAccount,
    mustBeLoggedIn,
    mustBeNotAdminAccount,
    shouldBeLoggedOut,
} from "@server/middlewares/auth";
import { validateEmailMiddleware } from "@server/middlewares/register";
import { test } from "./controller";

/**
 * @swagger
 * tags:
 *   name: Test Server
 *   description: API pour la tester l'application
 */

const router = express.Router();

/**
 * @swagger
 * /api/test/post:
 *   post:
 *     summary: Test POST Method
 *     tags: [Test, POST]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post("/post", test);

/**
 * @swagger
 * /api/test/get:
 *   post:
 *     summary: Test GET Method
 *     tags: [Test, GET]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.get("/get", test);


export default router;
