import { answer } from "@server/services/utils";
import { Request, Response } from "express";

// Logout account
export const test = (req: Request, res: Response) => {
	res.status(200).json(answer("Hello by Rayan Rav ! 😉"));
};
