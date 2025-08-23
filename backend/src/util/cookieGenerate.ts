import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import env from "./validate.js";
dotenv.config({ path: "../.env" });

import { type Response } from "express";
import type { Types } from "mongoose";

const cookieGenerate = (res: Response, userId: Types.ObjectId) => {
	const token = jwt.sign({ userId }, env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("session", token, {
		httpOnly: true,
		sameSite: "none",
		secure: env.NODE_ENV !== "development",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});

	return token;
};

export default cookieGenerate;
