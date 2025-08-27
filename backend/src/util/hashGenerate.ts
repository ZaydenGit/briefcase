import bcrypt from "bcrypt";
import dotenv from "dotenv";
import env from "./validate.js";
dotenv.config({ path: ".env" });
const hashGenerate = async (password: string) => {
	const salt = await bcrypt.genSalt(Number(env.ENCRYPTION_SALT));
	const hashedPass = await bcrypt.hash(password, salt);
	return hashedPass;
};

export default hashGenerate;
