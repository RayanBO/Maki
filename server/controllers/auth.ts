// controllers/auth.ts
import { Request, Response } from "express";
import { hashPassword, matchPassword } from "@server/services/crypto";
import { answer } from "@server/services/utils";
import { jwtCreate, jwtVerify } from "@server/services/jwt";
import { sendConfirmationEmail } from "@server/services/brevo";
import { CODE_VALIDITY_DURATION } from "@server/services/const";
import { getUserLogin } from "@server/models/UserVue";
import User from "@server/models/User";
import { setCookiesUser } from "@server/services/cookies";
import { _bo_log_ } from "@server/services/_";
// import { new_histo_login, new_histo_register } from "./historique";

/**
 * Auth controllers
 */

// Register new account to the app
export const register = async (req: Request, res: Response) => {
	const { email, password, is_admin, lastname, firstname } = req.body;

	const user = await User.findOne({ email }); // chec email 
	if (user) {
		return res.status(400).json({ message: "L'email exist déjà ! " });
	}
	if (!lastname) {
		return res.status(400).json({ message: "Lastname obligatoire ! " });
	}

	try {
		const hashedPassword = await hashPassword(password);
		let admin = is_admin;
		if (is_admin !== true) admin = false;

		// email confirm
		const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
		const hashedConfirmationCode = await hashPassword(confirmationCode);

		// Créer une ligne dans la table des utilisateurs (modèle User)
		const user = await User.create({
			email: email,
			password: hashedPassword,
			is_admin: admin,
			created_at: new Date(),
			is_driver: false,
			confirmed: false,
			confirmationCode: hashedConfirmationCode,
			confirmCodeExpireAt: new Date(new Date().getTime() + CODE_VALIDITY_DURATION), // Nouveau code valable pour 15 minutes,
			firstname: firstname || "",
			lastname: lastname
		});

		// send EMAIL
		await sendConfirmationEmail(email, confirmationCode)
		// -> return vu
		const { message, userVu } = await getUserLogin(email, password)
		// -> add Historique
		// await new_histo_register(userVu)
		//
		res
			.status(201)
			.json(answer(`Compte ${email} créé avec succès !`, userVu));
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: "Erreur de création de compte ! ",
		});
	}
};

// Returns which account is logged in
export const who = async (req: Request, res: Response) => {
	if (res.locals.user) {
		try {
			const t = req.cookies.token;  // Or wherever your token is stored
			if (t) {
				try {
					const decodedToken = await jwtVerify(t);
					res.locals.user = decodedToken.user;
					const email = res.locals?.user.email
					const password = 'WHO'
					const { message, userVu } = await getUserLogin(email, password)
					if (message === 'success') {
						res.status(200).json(answer("utilisateur actuellement connecté", userVu))
					} else {
						res.status(404).json(answer("Utilisateur non trouvé"))
					}

				} catch (error) {
					res.status(404).json(answer("Utilisateur non trouvé"))
				}
			}
		} catch (error) {
			res.status(404).json(answer("Utilisateur non trouvé"))
		}
	}
	else res.status(404).json(answer("Utilisateur non connecté"));
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password, device = 'android' } = req.body; // Définit 'android' par défaut si 'device' n'est pas fourni
		const { message, userVu } = await getUserLogin(email, password);

		if (message === "Compte introuvable") return res.status(401).json(answer(`Aucun compte n'est associé à ${email}`));
		if (message === "Mot de passe incorrect") return res.status(401).json(answer(`Mot de passe incorrect`));
		
		// Créer et enregistrer l'historique
		// if (userVu?.is_admin) {
		// 	await new_histo_login(userVu, 'WEB')
		// } else {
		// 	await new_histo_login(userVu, device)
		// }

		// Connexion réussie - définissez les cookies et renvoyez la réponse
		await setCookiesUser(userVu, res);
		res
			.status(200)
			.json(answer("Connecté avec succès !", userVu));
	} catch (err) {
		_bo_log_("error", err!.toString());

		let payload = {};
		if (err instanceof Error)
			payload = {
				message: err.message,
				name: err.name,
			};
		res.status(500).json(answer("Une erreur est survenue", payload));
	}
};

// Logout account
export const logout = (req: Request, res: Response) => {
	res.clearCookie("token");
	res.status(200).json(answer("Déconnecté avec succès !"));
};

export default {
	register,
	login,
	logout,
	who,
	// googleCallback,
};
