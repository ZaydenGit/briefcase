import { LoaderCircle } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import MainApp from "./MainApp";
import { apiRequest } from "./network/apiRequest";
import { AuthPage } from "./pages/AuthPage";
import type { ApiUser } from "./types/api.types";
import { LandingPage } from "./pages/LandingPage";

const App: FC = () => {
	const [authLoading, setAuthLoading] = useState(true);
	const [path, setPath] = useState<string>(window.location.pathname);
	const [user, setUser] = useState<ApiUser | null>(null);

	const navigate = (newPath: string) => {
		window.history.pushState({}, "", newPath);
		setPath(newPath);
	};

	useEffect(() => {
		const onLocationChange = () => setPath(window.location.pathname);
		window.addEventListener("popstate", onLocationChange);
		return () => window.removeEventListener("popstate", onLocationChange);
	}, []);

	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const authUser = await apiRequest<ApiUser>("/users");
				setUser(authUser);
				if (window.location.pathname === "/login") navigate("/dashboard");
			} catch {
				console.log("User not authenticated");
				setUser(null);
				if (window.location.pathname === "/dashboard") navigate("/login");
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
			navigate("/");
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

	switch (path) {
		case "/":
			return <LandingPage onLogout={logoutHandler} navigate={navigate} user={user} />;
		case "/login":
			return <AuthPage onAuthSuccess={setUser} navigate={navigate} />;
		case "/dashboard":
			if (!user) {
				navigate("login");
				return null;
			}
			return <MainApp user={user} onLogout={logoutHandler} navigate={navigate} />;
	}
};

export default App;
