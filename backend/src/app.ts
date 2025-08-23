import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { connectDatabase } from "./db.js";
import env from "./util/validate.js";

dotenv.config({ path: "../.env" });
const port = env.PORT || 5000;

import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import { requireAuth } from "./middleware/auth.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
	cors({
		origin: env.CLIENT_ORIGIN,
		credentials: true,
		methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use((req, res, next) => {
	const allowedOrigins = [env.CLIENT_ORIGIN];
	const origin = req.headers.host;
	if (allowedOrigins.includes(origin!)) next();
	else next(createHttpError(404, "Request blocked by cors"));
});

app.use("/api/users", userRoutes);
app.use("/api/expenses", requireAuth, expenseRoutes);
app.use("/api/incomes", requireAuth, incomeRoutes);
app.use("/api/goals", requireAuth, goalRoutes);

app.use((req, res, next) => {
	next(createHttpError(404, "Endpoint not found"));
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	try {
		console.error(err);
		if (createHttpError.isHttpError(err)) res.status(err.statusCode).json({ error: err.message });
		else res.status(500).json({ error: "An unknown error occurred" });
	} catch (err) {
		next(err);
	}
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

startServer();
