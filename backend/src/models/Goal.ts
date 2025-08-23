import { model, Schema, type InferSchemaType } from "mongoose";

const goalSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
		name: { type: String, required: true },
		targetAmount: { type: Number, required: true, min: 0 },
		currentAmount: { type: Number, default: 0, min: 0 },
		monthlyPayment: { type: Number, default: 0, min: 0 },
		deadline: { type: Date },
	},
	{ timestamps: true }
);

export type Goal = InferSchemaType<typeof goalSchema>;
export default model<Goal>("Goal", goalSchema);
