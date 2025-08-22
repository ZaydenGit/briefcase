import { model, Schema, type InferSchemaType } from "mongoose";

const ExpenseSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
		title: { type: String, required: true },
		amount: { type: Number, required: true, min: 0 },
		category: { type: String, required: true },
		date: { type: Date, required: true },
	},
	{ timestamps: true }
);

export type Expense = InferSchemaType<typeof ExpenseSchema>;
export default model<Expense>("RecurringExpense", ExpenseSchema);
