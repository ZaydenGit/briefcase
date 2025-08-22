import mongoose from "mongoose";
export async function connectDatabase(uri: string) {
	if (mongoose.connection.readyState >= 1) return;
	await mongoose
		.connect(uri)
		.then(() => {
			console.log("Mongoose connected");
		})
		.catch(console.error);
}
