import { LoaderCircle } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import MainApp from "./MainApp";
import { apiRequest } from "./network/apiRequest";
import { AuthPage } from "./pages/AuthPage";
import type { ApiUser } from "./types/api.types";

const App: FC = () => {
	const [authLoading, setAuthLoading] = useState(true);

	const [user, setUser] = useState<ApiUser | null>(null);

	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const authUser = await apiRequest<ApiUser>("/users");
				setUser(authUser);
			} catch {
				console.log("User not authenticated");
				setUser(null);
			} finally {
				setAuthLoading(false);
			}
		};
		checkAuthStatus();
	}, []);

	const logoutHandler = async () => {
		try {
			await apiRequest("/users/logout", "POST");
			setUser(null);
		} catch (err) {
			console.error("Logout Failed", err);
		}
	};

	if (authLoading)
		return (
			<div className='flex items-center justify-center min-h-screen bg-gray-100'>
				<LoaderCircle className='w-16 h-16 animate-spin text-blue-600' />
			</div>
		);

	return user ? <MainApp user={user} onLogout={logoutHandler} /> : <AuthPage onAuthSuccess={setUser} />;
};

export default App;
