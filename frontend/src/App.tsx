import { useEffect, useState, type FC } from "react";
import { apiRequest } from "./network/apiRequest";
import { Loader, LoaderCircle } from "lucide-react";
import {
	type ApiUser,
	formatApiData,
	type ApiExpense,
	type ApiGoal,
	type ApiIncome,
	type AppData,
} from "./utils/formatApiData";
import { AuthPage } from "./pages/AuthPage";

type ViewState = { type: "overview" } | { type: "month"; year: string; month: string } | { type: "goals" };

const App: FC = () => {
	const [currentView, setCurrentView] = useState<ViewState>({ type: "overview" });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [appData, setAppData] = useState<AppData | null>(null);
	const [user, setUser] = useState<ApiUser | null>(null);

	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const authUsre = await apiRequest<ApiUser>("/users");
				setUser(authUsre);
			} catch (err) {
				console.log("User not authenticated");
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		checkAuthStatus();
		// const fetchData = async () => {
		// 	try {
		// 		setLoading(true);
		// 		const [incomes, expenses, goals] = await Promise.all([
		// 			apiRequest<ApiIncome[]>("/incomes"),
		// 			apiRequest<ApiExpense[]>("/expenses"),
		// 			apiRequest<ApiGoal[]>("/goals"),
		// 		]);
		// 		setAppData(await formatApiData(incomes, expenses, goals));
		// 		setError(null);
		// 	} catch (err: any) {
		// 		alert(err.message);
		// 		setError(err.message);
		// 	} finally {
		// 		setLoading(false);
		// 	}
		// };
	}, []);

	if (loading)
		return (
			<div className='flex items-center justify-center min-h-screen bg-gray-100'>
				<LoaderCircle className='w-16 h-16 animate-spin text-blue-600' />
			</div>
		);

	const render = () => {
		if (loading)
			return (
				<div className='flex items-center justify-center h-full'>
					<LoaderCircle className='w-12 h-12 animate-spin text-blue-500' />
				</div>
			);
		else return <p>Hi</p>;
	};

	return user ? (
		<main className='flex-1 h-screen overflow-y-auto'>{render()}</main>
	) : (
		<AuthPage onAuthSuccess={setUser} />
	);
};

export default App;
