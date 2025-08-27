import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import Goal from "../models/Goal.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const list: RequestHandler = async (req, res, next) => {
	try {
		if (!req.user) throw createHttpError(401, "User not authorized");
		const goals = await Goal.find({ userId: req.user.id }).sort({ date: -1 });
		return res.status(200).json(goals);
	} catch (err) {
		next(err);
	}
};

interface CreateBody {
	name?: string;
	targetAmount?: number;
	currentAmount?: number;
	monthlyPayment?: number;
}

export const create: RequestHandler<unknown, unknown, CreateBody, unknown> = async (req, res, next) => {
	try {
		const { name, targetAmount, currentAmount, monthlyPayment } = req.body;
		if (!name || !targetAmount || !currentAmount || !monthlyPayment) throw createHttpError(400, "Parameters missing");
		if (!req.user) throw createHttpError(401, "User not authorized");
		const newGoal = new Goal({
			userId: req.user.id,
			name,
			targetAmount,
			currentAmount,
			monthlyPayment,
		});
		await newGoal.save();
		res.status(201).json({ message: "Goal created successfully", goal: newGoal });
	} catch (err) {
		next(err);
	}
};

interface UpdateParams {
	id: string;
}

interface UpdateBody {
	name?: string;
	targetAmount?: number;
	currentAmount?: number;
	monthlyPayment?: number;
}

export const update: RequestHandler<UpdateParams, unknown, UpdateBody, unknown> = async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!req.user) throw createHttpError(401, "User not authorized");
		const payload = await (jwt.verify(req.cookies.session, process.env.JWT_SECRET!) as { userId: string });
		const authUser = await User.findById(payload.userId).select("+email").exec();
		if (!authUser) throw createHttpError(404, "User not authenticated");
		if (req.user.id !== authUser.id) throw createHttpError(401, "User not authorized");
		const goal = await Goal.findById(id);
		if (!goal) throw createHttpError(404, "Goal not found");
		const { name, targetAmount, currentAmount, monthlyPayment } = req.body;
		if (!name && !targetAmount && !currentAmount && !monthlyPayment)
			throw createHttpError(400, "At least one field must be updated");
		if (
			name === goal.name &&
			targetAmount === goal.targetAmount &&
			currentAmount === goal.currentAmount &&
			monthlyPayment === goal.monthlyPayment
		)
			throw createHttpError(400, "No changes detected");
		if (name && name !== goal.name) goal.name = name;
		if (currentAmount && currentAmount !== goal.currentAmount) goal.currentAmount = currentAmount;
		if (targetAmount && targetAmount !== goal.targetAmount) goal.targetAmount = targetAmount;
		if (monthlyPayment && monthlyPayment !== goal.monthlyPayment) goal.monthlyPayment = monthlyPayment;
		const updatedGoal = await goal.save();
		res.status(200).json({ message: "Updated goal successfully", expense: updatedGoal });
	} catch (err) {
		next(err);
	}
};

interface ContributeParams {
	id: string;
}

interface ContributeBody {
	contribution?: number;
}

export const contribute: RequestHandler<ContributeParams, unknown, ContributeBody, unknown> = async (
	req,
	res,
	next
) => {
	try {
		console.log(req.body);
		const { id } = req.params;
		if (!req.user) throw createHttpError(401, "User not authorized");
		const payload = await (jwt.verify(req.cookies.session, process.env.JWT_SECRET!) as { userId: string });
		const authUser = await User.findById(payload.userId).select("+email").exec();
		console.log(authUser);
		if (!authUser) throw createHttpError(404, "User not authenticated");
		if (req.user.id !== authUser.id) throw createHttpError(401, "User not authorized");

		const goal = await Goal.findById(id).exec();
		if (!goal) throw createHttpError(404, "Goal not found");
		const { contribution } = req.body;
		if (!contribution) throw createHttpError(400, "Must have a contribution amount");
		goal.currentAmount += contribution;
		const updatedGoal = await goal.save();
		res.status(200).json({
			message: `Contributed ${contribution} to currentAmount (${goal.currentAmount} total)`,
			goal: updatedGoal,
		});
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
		const goal = await Goal.findById(id);
		if (!goal) throw createHttpError(404, "Goal not found");
		await goal.deleteOne();
		res.status(200).json({ message: "Removed goal" });
	} catch (err) {
		next(err);
	}
};
