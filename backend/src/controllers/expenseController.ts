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
	title?: string;
	amount?: number;
	category?: string;
	date?: string;
}

export const create: RequestHandler<unknown, unknown, CreateBody, unknown> = async (req, res, next) => {
	try {
		const { title, amount, category, date } = req.body;
		if (!title || !amount || !category) throw createHttpError(400, "Parameters missing");
		if (!req.user) throw createHttpError(401, "User not authorized");
		const newExpense = new Expense({
			userId: req.user.id,
			title,
			amount,
			category,
			date: date || new Date(),
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
	title?: string;
	amount?: number;
	category?: string;
	date?: Date;
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
		const { title, amount, category, date } = req.body;
		if (!title && !amount && !category && !date) throw createHttpError(400, "At least one field must be updated");
		if (title === expense.title && amount === expense.amount && category === expense.category && date === expense.date)
			throw createHttpError(400, "No changes detected");

		//add validation to these sections later
		if (title && expense.title !== title) expense.title = title;
		if (amount && expense.amount !== amount) expense.amount = amount;
		if (category && expense.category !== category) expense.category = category;
		if (date && expense.date !== date) expense.date = date;
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
