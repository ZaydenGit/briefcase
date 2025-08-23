import bcrypt from "bcrypt";
import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import { User } from "../models/User.js";
import hashGenerate from "../util/hashGenerate.js";
import cookieGenerate from "../util/cookieGenerate.js";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
	try {
		const user = await User.findById(req.cookies.session.userId).select("+email").exec();
		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};

interface RegisterBody {
	username?: string;
	email?: string;
	password?: string;
}

export const register: RequestHandler<unknown, unknown, RegisterBody, unknown> = async (req, res, next) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) throw createHttpError(400, "Parameters missing");
		const emailExists = await User.findOne({ email });
		if (emailExists) throw createHttpError(409, "Email is already registered. Please choose a different one or login.");
		const userNameExists = await User.findOne({ username });
		if (userNameExists)
			throw createHttpError(409, "Username is already taken. Please choose a different one or login.");
		const hashedPassword = await hashGenerate(password);
		const newUser = new User({ username, email, password: hashedPassword });
		await newUser.save();
		await cookieGenerate(res, newUser._id);
		res.status(200).json({ message: "User registered succsesfully." });
	} catch (err) {
		next(err);
	}
};

interface LoginBody {
	email?: string;
	password?: string;
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) throw createHttpError(400, "Parameters missing");
		const existingUser = await User.findOne({ email }).select("+password");
		if (!existingUser) throw createHttpError(401, "Invalid credentials");
		const validPassword = await bcrypt.compare(password, existingUser.password);
		if (!validPassword) throw createHttpError(401, "Invalid credentials");
		await cookieGenerate(res, existingUser._id);
		res.status(200).json({ message: "Logged in successfully." });
	} catch (err) {
		next(err);
	}
};

export const logout: RequestHandler = async (req, res, next) => {
	const token = req.cookies.session;
	if (token) {
		await res.clearCookie("session");
		return res.status(200).json({ message: "Logged out successfully" });
	} else {
		next(createHttpError(401, "You must be authenticated to access this resource."));
	}
};
