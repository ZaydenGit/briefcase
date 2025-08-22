import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export type AuthedRequest = Request & { user?: { id: string } };

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
	const token = req.cookies?.token;
	if (!token) return createHttpError(401, "User not authenticated");
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
		req.user = { id: payload.userId };
		next();
	} catch {
		next(createHttpError(401, "Invalid Token"));
	}
}
