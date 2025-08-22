import dotenv from "dotenv";
import { cleanEnv, num, port, str } from "envalid";
dotenv.config({ path: "../.env" });

export default cleanEnv(process.env, {
	MONGODB_URI: str(),
	PORT: port(),
	CLIENT_ORIGIN: str(),
	ENCRYPTION_SALT: num(),
	NODE_ENV: str(),
});
