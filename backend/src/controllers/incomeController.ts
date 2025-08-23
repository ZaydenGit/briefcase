import type { RequestHandler } from "express";
import Income from "../models/Income.js";
import createHttpError from "http-errors";
import { User } from "../models/User.js";

export const list: RequestHandler = async (req, res, next) => {
	try {
		if (!req.user) throw createHttpError(401, "User not authorized");
		const incomes = await Income.find({ userId: req.user.id }).sort({ amount: -1 });
		return res.status(200).json(incomes);
	} catch (err) {
		next(err);
	}
};

interface CreateBody {
	title?: string;
	amount?: number;
	category?: string;
}

export const create: RequestHandler<unknown, unknown, CreateBody, unknown> = async (req, res, next) => {
	try {
		const { title, amount, category } = req.body;
		if (!title || !amount || !category) throw createHttpError(400, "Parameters missing");
		if (!req.user) throw createHttpError(401, "User not authorized");
		const newIncome = new Income({
			userId: req.user.id,
			title,
			amount,
			category,
		});
		await newIncome.save();
		res.status(201).json(newIncome);
	} catch (err) {
		next(err);
	}
};

interface UpdateParams {
	id: string;
}

interface UpdateBody {
	title?: string;
	amount?: number;
	category?: string;
}
export const update: RequestHandler<UpdateParams, unknown, UpdateBody, unknown> = async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!req.user) throw createHttpError(401, "User not authorized");
		const authUser = await User.findOne({ userId: req.cookies.session.userId }).select("+email").exec();
		if (!authUser) throw createHttpError(404, "User not authenticated");
		if (req.user.id !== authUser.id) throw createHttpError(401, "User not authorized");
		const income = await Income.findById(id);
		if (!income) throw createHttpError(404, "Income not found");
		const { title, amount, category } = req.body;
		if (!title && !amount && !category) throw createHttpError(400, "At least one field must be updated");
		if (title === income.title && amount === income.amount && category === income.category)
			throw createHttpError(400, "No changes detected");

		//add validation to these sections later
		if (title && income.title !== title) income.title = title;
		if (amount && income.amount !== amount) income.amount = amount;
		if (category && income.category !== category) income.category = category;
		const updatedIncome = await income.save();

		res.status(200).json({ message: "Updated income successfully", income: updatedIncome });
	} catch (err) {
		next(err);
	}
};

interface RemoveParams {
	id: string;
}

export const remove: RequestHandler<RemoveParams> = async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!req.user) throw createHttpError(401, "User not authorized");
		const income = await Income.findById(id);
		if (!income) throw createHttpError(404, "Income not found");
		await income.deleteOne();
		res.status(200).json({ message: "Removed income" });
	} catch (err) {
		next(err);
	}
};
