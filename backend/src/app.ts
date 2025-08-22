import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import env from "./util/validate.js";

dotenv.config({ path: "../.env" });
import { connectDatabase } from "./db.js";
const port = env.PORT || 5000;

import cookieParser from "cookie-parser";
import express from "express";
import createHttpError from "http-errors";
// import morgan from "morgan";
import { requireAuth } from "./middleware/auth.js";
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
const app = express();

// app.use(morgan("dev"));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
	cors({
		origin: env.CLIENT_ORIGIN,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use((req, res, next) => {
	const allowedOrigins = [env.CLIENT_ORIGIN];
	const origin = req.headers.origin;

	if (allowedOrigins.includes(origin!)) next();
	else {
		createHttpError(404, "Request blocked by cors");
		return;
	}
});

app.use("/api/users", userRoutes);
app.use("/api/expenses", requireAuth, expenseRoutes);
app.use("/api/income", requireAuth, incomeRoutes);
app.use("/api/goals", requireAuth, goalRoutes);

app.use((req, res, next) => {
	next(createHttpError(404, "Endpoint not found"));
});

export default app;

const startServer = async () => {
	try {
		await connectDatabase(env.MONGODB_URI!);
		app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
	} catch (err) {
		console.error("Connection to Database failed:", err);
		process.exit(1);
	}
};

console.log("h");
startServer();
