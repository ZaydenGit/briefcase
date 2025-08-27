import type { RequestHandler } from "express";
import Expense from "../models/Expense.js";
import createHttpError from "http-errors";
import { User } from "../models/User.js";

export const list: RequestHandler = async (req, res, next) => {
	try {
		if (!req.user) throw createHttpError(401, "User not authorized");
		const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
		return res.status(200).json(expenses);
	} catch (err) {
		next(err);
	}
};
interface CreateBody {
	name?: string;
	amount?: number;
	// category?: string;
	date?: string;
	isRecurring?: boolean;
}

export const create: RequestHandler<unknown, unknown, CreateBody, unknown> = async (req, res, next) => {
	try {
		const { name, amount, date, isRecurring } = req.body;
		if (!name || !amount) throw createHttpError(400, "Parameters missing");
		if (!req.user) throw createHttpError(401, "User not authorized");
		const newExpense = new Expense({
			userId: req.user.id,
			name,
			amount,

			date: date || new Date(),
			isRecurring,
		});
		await newExpense.save();
		res.status(201).json(newExpense);
	} catch (err) {
		next(err);
	}
};

interface UpdateParams {
	id: string;
}

interface UpdateBody {
	name?: string;
	amount?: number;
	category?: string;
	date?: Date;
	isRecurring?: boolean;
}

export const update: RequestHandler<UpdateParams, unknown, UpdateBody, unknown> = async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!req.user) throw createHttpError(401, "User not authorized");
		const authUser = await User.findOne({ userId: req.cookies.session.userId }).select("+email").exec();
		if (!authUser) throw createHttpError(404, "User not authenticated");
		if (req.user.id !== authUser.id) throw createHttpError(401, "User not authorized");
		const expense = await Expense.findById(id);
		if (!expense) throw createHttpError(404, "Expense not found");
		const { name, amount, date, isRecurring } = req.body;
		if (!name && !amount && !date && !isRecurring) throw createHttpError(400, "At least one field must be updated");
		if (
			name === expense.name &&
			amount === expense.amount &&
			// category === expense.category &&
			date === expense.date &&
			isRecurring === expense.isRecurring
		)
			throw createHttpError(400, "No changes detected");

		//add validation to these sections later
		if (name && expense.name !== name) expense.name = name;
		if (amount && expense.amount !== amount) expense.amount = amount;
		// if (category && expense.category !== category) expense.category = category;
		if (date && expense.date !== date) expense.date = date;
		if (typeof isRecurring !== "undefined" && isRecurring !== expense.isRecurring) expense.isRecurring = isRecurring;
		const updatedExpense = await expense.save();

		res.status(200).json({ message: "Updated expense successfully", expense: updatedExpense });
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
		const expense = await Expense.findById(id);
		if (!expense) throw createHttpError(404, "Expense not found");
		await expense.deleteOne();
		res.status(200).json({ message: "Removed expense" });
	} catch (err) {
		next(err);
	}
};
