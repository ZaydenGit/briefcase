import dotenv from "dotenv";
import { cleanEnv, num, port, str } from "envalid";
dotenv.config({ path: ".env" });

export default cleanEnv(process.env, {
	MONGODB_URI: str(),
	PORT: port(),
	BACKEND_BASEURL: str(),
	ENCRYPTION_SALT: num(),
	NODE_ENV: str(),
	JWT_SECRET: str(),
});
