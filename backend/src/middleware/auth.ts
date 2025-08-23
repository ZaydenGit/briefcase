import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { User, type UserType } from "../models/User.js";
import type { HydratedDocument } from "mongoose";

export type AuthedRequest = Request & { user?: HydratedDocument<UserType> };

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
	// console.log(req);
	const token = req.cookies.session;
	// console.log(token);
	if (!token) throw createHttpError(401, "User not authenticated");
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
		// console.log(payload);
		const user = await User.findById(payload.userId);
		if (!user) return next(createHttpError(401, "User not found"));
		req.user = user;
		return next();
	} catch {
		return next(createHttpError(401, "Invalid Token"));
	}
}
