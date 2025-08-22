import { model, Schema, type InferSchemaType } from "mongoose";

const goalSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
		name: { type: String, required: true },
		goalTargetAmount: { type: Number, required: true, min: 0 },
		currentAmount: { type: Number, default: 0, min: 0 },
		monthlyPaymnt: { type: Number, default: 0, min: 0 },
	},
	{ timestamps: true }
);

export type Goal = InferSchemaType<typeof goalSchema>;
export default model<Goal>("Goal", goalSchema);
