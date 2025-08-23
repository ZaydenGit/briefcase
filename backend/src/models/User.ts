import { model, Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true, select: false },
	password: { type: String, required: true, select: false },
});

export type UserType = InferSchemaType<typeof userSchema>;
export const User = model<UserType>("User", userSchema);
