import { model, Schema, type InferSchemaType } from "mongoose";

const incomeSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
		title: { type: String, required: true },
		amount: { type: Number, required: true },
		category: { type: String, required: true },
	},
	{ timestamps: true }
);

export type Income = InferSchemaType<typeof incomeSchema>;
export default model<Income>("Income", incomeSchema);
