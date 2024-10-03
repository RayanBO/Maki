import type { NextFunction, Request, Response } from "express";
import { jwtVerify } from "@server/services/jwt";
import { answer } from "@server/services/utils";
import User from "@server/models/User";

/**
 * Authentication middlewares
 */

/**
 * Generates the account object from given token in request
 * If valid, the account will be saved in the response locals
 */
export const getCurrentAccount = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { token } = req.cookies;
	jwtVerify(token)
		.then(({ account_id }) => User.findOne({ account_id }))
		.then((user) => {
			res.locals.user = user;
		})
		.catch(() => {
			res.locals.user = null;
		})
		.finally(next);
};

// User must be logged out to access next route
export const mustBeLoggedOut = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.locals.user)
		res.status(403).json(answer("Veuillez vous déconnecter d'abord"));
	else next();
};

// User "should" be logged out for the next route
export const shouldBeLoggedOut = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.locals.user) res.status(400).json(answer("Vous êtes déjà connecté"));
	else next();
};

// User must be logged in to access next route
// export const mustBeLoggedInIAM = (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	if (res.locals.user) {
// 		const { email } = req.body;
// 		if (res.locals.user.email === email) {
// 			next();
// 		} else {
// 			res.status(401).json(answer("L'email connecté est différent de l'email en action !"))
// 		}
// 	}
// 	else res.status(401).json(answer("Vous n'êtes pas connecté"));
// };

// User must be logged in to access next route
export const mustBeLoggedIn = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.locals.user) next();
	else res.status(401).json(answer("Vous n'êtes pas connecté"));
};

// The user must be logged as admin to check the next route
export const mustBeLoggedAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	User.findOne({ email: res.locals.user.email })
		.then((user) => {
			if (user && user.is_admin) next();
			else
				res
					.status(403)
					.json(
						answer("Vous devez être un admnistrateur pour effectuer cette action")
					);
		})
		.catch(() => {
			res
				.status(403)
				.json(
					answer("Vous devez être un admnistrateur pour effectuer cette action")
				);
		});
};

// The account must an admin to check the next route
export const mustBeNotAdminAccount = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email } = req.body;
	User.findOne({ email })
		.then((user) => {
			if (!user?.is_admin) next();
			else
				res
					.status(403)
					.json(
						answer("Compte n'est pas client ! ")
					);
		})
		.catch(() => {
			res.status(401).json(answer("Ce compte n'a pas été trouvé"));
		});
};

// The account must an admin to check the next route
export const mustBeAdminAccount = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email } = req.body;
	User.findOne({ email })
		.then((user) => {
			if (user?.is_admin) next();
			else
				res
					.status(403)
					.json(
						answer("Vous devez être un admnistrateur pour effectuer cette action")
					);
		})
		.catch(() => {
			res.status(401).json(answer("Ce compte n'a pas été trouvé"));
		});
};


// The account must an admin to check the next route
export const mustBeAdminActif = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const t = req.cookies?.token;
		const decodedToken = await jwtVerify(t);
		res.locals.user = decodedToken.user;
		const email = res.locals?.user.email

		User.findOne({ email })
			.then((user) => {
				if (user?.is_admin) next();
				else
					res
						.status(403)
						.json(
							answer("Vous devez être un admnistrateur pour effectuer cette action")
						);
			})
			.catch(() => {
				res.status(401).json(answer("Ce compte n'a pas été trouvé"));
			});

	} catch (error) {
		res.status(401).json(answer("Token non pris "));
	}

};

export default {
	mustBeLoggedOut,
	shouldBeLoggedOut,
	mustBeLoggedIn,
	mustBeLoggedAdmin,
	mustBeAdminAccount,
	mustBeAdminActif
};
