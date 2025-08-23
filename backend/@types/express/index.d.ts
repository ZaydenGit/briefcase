import type { HydratedDocument } from "mongoose";
import type { UserType } from "../../src/models/User.js";

declare global {
	namespace Express {
		interface Request {
			user?: HydratedDocument<UserType>;
		}
	}
}
