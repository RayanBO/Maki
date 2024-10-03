import { NextFunction, Request, Response } from "express";

/**
 * Manage CORS here
 */

export const cors = (req: Request, res: Response, next: NextFunction) => {
	const origin = req.headers.origin;
	// Allow incoming origin
	if (origin) res.header("Access-Control-Allow-Origin", origin);
	// With credentials
	res.header("Access-Control-Allow-Credentials", "true");
	// Methods allowed
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
	// Additional headers
	res.header(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, x-requested-with"
	);
	// Handle preflight requests
	if (req.method === "OPTIONS") return res.sendStatus(200);
	next();
};
